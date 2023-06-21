import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';

import { User, UserDocument } from './schemas/user.schema';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PhoneOtpDto } from 'src/auth/dto/phoneOtp.dto';
import { RoleEnum } from './enum/role.enum';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { FieldAlreadyExists } from 'src/utils/error';
import { OfficeService } from 'src/office/office.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => PhoneService)) private phoneService: PhoneService,
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    @Inject(forwardRef(() => OfficeService)) private officeService: OfficeService,
  ) { }


  // *
  async findOrCreateByPhone({ phone }: PhoneOtpDto): Promise<User> {
    let user: User
    try {
      const phoneQ = await this.phoneService.find(phone, useForEnum.User)
      user = await this.userModel.findById(phoneQ.user).select(["_id", "roles", "firstName", "lastName", "fullName", "avatar"])
      return user
    } catch (error) {
      const userData = { active: true, roles: [RoleEnum.User] } as CreateUserDto
      user = new this.userModel(userData)
      try {
        const phoneID = await this.phoneService.setup(phone, useForEnum.User, user)
        user.phone = phoneID
        await user.save()
        return user
      } catch (error) {
        FieldAlreadyExists("phone")
      }
    }
  }

  // *
  async sendPhoneOtpCode(user: User) {
    return await this.phoneService.sendOtpCode(user.phone.value)
  }

  // *
  async confirmPhoneOtpCode(user: User, token: string) {
    const isValid = await this.phoneService.confirmOtpCode({ phone: user.phone.value, token })
    if (!isValid) {
      throw new ForbiddenException({ message: "Token is wrong" })
    }
  }


  // *
  async getUserPayload(id: string) {
    return await this.findOne(id)
      .select(["_id", "roles", "firstName", "lastName", "fullName", "avatar"])
  }



  async assignList(search: string = "") {
    if (!search.length) return []
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

  // *
  async create(data: CreateUserDto): Promise<any> {
    const { phone, email, ...modelData } = data
    const _user = new this.userModel(modelData)

    if (phone) await this.setPhone(_user, phone)
    if (email) await this.setEmail(_user, email)

    // save
    await _user.save()
    return _user;
  }

  // *
  async update(id: string, data: UpdateUserDto): Promise<any> {
    const { phone, email, ...modelData } = data
    const _user = await this.userModel.findById(id)

    if (phone) await this.setPhone(_user, phone)
    if (email) await this.setEmail(_user, email)

    return this.userModel.updateOne({ _id: id }, modelData).exec();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).populate(['phone']);
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
      FieldAlreadyExists("phone.value")
    }
  }
  // ======> email
  async setEmail(user: User, email: EmailDto) {
    try {
      const emailID = await this.emailService.setup(email.value, useForEnum.User, user, email.verified)
      user.email = emailID
    } catch (error) {
      FieldAlreadyExists("email.value")
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
