import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import { User, UserDocument } from './schemas/user.schema';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PhoneService } from '../phone/phone.service';
import { EmailService } from '../email/email.service';
import { PhoneOtpDto } from 'src/auth/dto/phoneOtp.dto';
import { RoleEnum } from './enum/role.enum';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { EmailDto } from 'src/email/dto/email.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) { }

  // ok
  async findOrCreateByPhone({ phone }: PhoneOtpDto): Promise<User> {
    let user: User
    try {
      const phoneQ = await this.phoneService.find(phone, useForEnum.User)
      user = await this.userModel.findById(phoneQ.user)
      return user
    } catch (error) {
      const userData = {
        active: true,
        roles: [RoleEnum.User],
      } as CreateUserDto
      user = new this.userModel(userData)
      const phoneID = await this.phoneService.setup(phone, useForEnum.User, user)
      user.phone = phoneID
      await user.save()
      return user
    }
  }

  async assignList(search: string = "") {
    return (await this.userModel
      .find(
        {
          $or: [
            { firstName: { $regex: search } },
            { lastName: { $regex: search } },
          ]
        },
        { phone: 0, email: 0, avatar: 0, password: 1 }
      )
      .limit(20)
    ).map((doc) => ({ title: doc.fullName, value: doc._id }))
  }

  findUserAuth(user: User, withPassword = false): Promise<User> {
    return this.userModel.findById(user._id, { password: withPassword }).exec();
  }

  //

  statics(subject: string) {
    return {
      roles: RoleEnum
    }[subject]
  }

  async create(data: CreateUserDto): Promise<any> {
    const { phone, email, ...modelData } = data

    const _user = new this.userModel(modelData)

    if (phone) await this.setPhone(_user, phone)
    if (email) await this.setEmail(_user, email)

    await _user.save()
    return _user;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).populate(['phone']);
  }

  async update(id: string, data: UpdateUserDto): Promise<any> {
    const { phone, email, ...modelData } = data

    // modelData.location = modelData.location.split(",").map((v: string) => +v)
    console.log(modelData);


    const _user = await this.userModel.findById(id)

    if (phone) await this.setPhone(_user, phone)
    if (email) await this.setEmail(_user, email)

    return this.userModel.updateOne({ _id: id }, modelData).exec();
  }


  async remove(id: string) {
    const o = await this.findOne(id)
    if (o.phone) this.phoneService.remove(o.phone?._id);
    if (o.email) this.emailService.remove(o.email?._id);
    await o.remove();
  }


  // ======> phone
  async setPhone(user: User, phone: PhoneDto) {
    try {
      const phoneID = await this.phoneService.setup(phone.value, useForEnum.User, user, phone.verified)
      user.phone = phoneID
    } catch (error) {
      throw new BadRequestException({
        errors: [
          {
            property: "phone.value",
            constraints: { "IsAlreadyExists": "این شماره قبلا ثبت شده است" }
          }
        ]
      })
    }
  }
  // ======> email
  async setEmail(user: User, email: EmailDto) {
    try {
      const emailID = await this.emailService.setup(email.value, useForEnum.User, user, email.verified)
      user.email = emailID
    } catch (error) {
      throw new BadRequestException({
        errors: [
          {
            property: "email.value",
            constraints: { "IsAlreadyExists": "این ایمیل قبلا ثبت شده است" }
          }
        ]
      })
    }
  }


  // ==>
  async getOrCheck(data: User | string): Promise<User> {
    let _data: User
    if (typeof data === 'string')
      _data = await this.findOne(data)
    else
      _data = data

    return _data
  }


  async hasSuperAdminRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.SuperAdmin) && _user
  }

  async hasAdminRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.Admin) && _user
  }

  async hasAgentRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.Agent) && _user
  }

  async hasAuthorRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.Author) && _user
  }

  async hasUserRole(user: User | string): Promise<boolean | User> {
    let _user: User = await this.getOrCheck(user)
    return _user.roles.includes(RoleEnum.User) && _user
  }

}
