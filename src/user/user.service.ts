import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { User, UserDocument } from './schemas/user.schema';

import { RegistrationDto } from '../auth/dto/registration.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { PhoneService } from '../phone/phone.service';
import { EmailService } from '../email/email.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) {}

  async create(data: CreateUserDto | RegistrationDto): Promise<User> {
    const { email, phone, ..._data } = data;
    const user = new this.userModel(_data);

    // => phone & email
    let autoVerify: boolean, mustVerify: boolean;
    if (data instanceof CreateUserDto) {
      autoVerify = false;
      mustVerify = false;
    } else {
      autoVerify = false;
      mustVerify = true;
    }
    if (email) {
      user.email = await this.emailService.setup(
        email,
        user,
        autoVerify,
        mustVerify,
      );
    }
    if (phone) {
      user.phone = await this.phoneService.setup(
        phone,
        user,
        autoVerify,
        mustVerify,
      );
    }
    // #
    return await user.save();
  }

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