import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { User, UserDocument } from './schemas/user.schema';

import { RegistrationDto } from './dto/registration.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PhoneService } from '../phone/phone.service';
import { EmailService } from '../email/email.service';
import { PhoneOtpDto } from 'src/auth/dto/phoneOtp.dto';
import { UserStatusEum } from './enum/userStatus.enum';
import { RoleEnum } from './enum/role.enum';
import { useForEnum } from 'src/auth/enum/useFor.enum';
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
      user = await this.findOne(phoneQ.user)
      return user
    } catch (error) {
      const userData = {
        status: UserStatusEum.NewUser,
        roles: [RoleEnum.User],
      } as CreateUserDto

      user = new this.userModel(userData)
      const phoneID = await this.phoneService.setup(phone, useForEnum.User, user)
      user.phone = phoneID
      await user.save()

      return user
    }
  }

  // ok
  async registration(user: User, data: RegistrationDto): Promise<User> {
    return user
  }

  // ===================

  async passwordChange(user: User, data: ChangePasswordDto) {
    user = await this.findUserAuth(user, true);
    const { password, oldPassword } = data;
    const isMatch = await user.checkPassword(oldPassword);
    if (!isMatch) throw new ForbiddenException('Current password is incorrect');
    user.password = password;
    await user.save();
    return true;
  }

  findUserAuth(user: User, withPassword = false): Promise<User> {
    return this.userModel.findById(user._id, { password: withPassword }).exec();
  }

  findByUsername(username: string, withPassword = false): Promise<User> {
    return this.userModel
      .findOne({ username: username }, { password: withPassword })
      .exec();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().populate('email').exec();
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  }

  remove(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
