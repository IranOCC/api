import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserStatusEum } from '../user/enum/userStatus.enum';
import { User } from '../user/schemas/user.schema';

import { PasswordResetConfirmDto } from './dto/passwordResetConfirm.dto';
import { PasswordResetRequestDto } from './dto/passwordResetRequest.dto';
import { RegistrationDto } from './dto/registration.dto';

import { TokenConfirmEmailDto } from '../email/dto/tokenConfirmEmail.dto';
import { TokenRequestEmailDto } from '../email/dto/tokenRequestEmail.dto';
import { TokenConfirmPhoneDto } from '../phone/dto/tokenConfirmPhone.dto';
import { TokenRequestPhoneDto } from '../phone/dto/tokenRequestPhone.dto';

import { UserService } from '../user/user.service';
import { PasswordResetMethods } from './enum/passwordResetMethod.enum';

import { useForEnum } from './enum/useFor.enum';
import { EmailService } from '../email/email.service';
import { PhoneService } from '../phone/phone.service';
import { PhoneOtpDto } from './dto/phoneOtp.dto';
import { SmsService } from 'src/sms/sms.service';
import { PhoneOtpConfirm } from './dto/phoneOtpConfirm.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private emailService: EmailService,
    private phoneService: PhoneService,
  ) { }

  async phoneOtp(data: PhoneOtpDto) {
    // find or create 
    const user = await this.userService.findOrCreateByPhone(data);
    // send otp
    try {
      await this.phoneService.sendOtpCode(user.phone.value)
    } catch (error) {
      throw new InternalServerErrorException({ message: JSON.stringify(error) })
    }
    // return
    return { phone: user.phone.value };
  }

  async loginByOtp(data: PhoneOtpConfirm) {
    // confirm otp
    const isValid = await this.phoneService.confirmOtpCode(data)
    if (!isValid) {
      throw new ForbiddenException({ message: "Token is wrong" })
    }

    const phoneQ = await this.phoneService.find(data.phone, useForEnum.User)
    const user = await this.userService.findOne(phoneQ.user).select(["_id", "roles", "status", "firstName", "lastName", "fullName", "emailAddress", "phoneNumber", "avatar"])
    const payload = user.toJSON();
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRE_IN });
    return {
      user,
      accessToken
    };
  }



  async getMe(user: User) {
    const _user = await this.userService.findOne(user._id)
      .select(["_id", "roles", "status", "firstName", "lastName", "fullName", "emailAddress", "phoneNumber", "avatar"])

    return _user as User;
  }

  async registrationPhone(data: RegistrationDto) {
    // return await this.userService.create(data);
  }




}
