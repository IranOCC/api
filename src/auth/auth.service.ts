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


  async validateUser(_username: string, _password: string): Promise<any> {
    const user = await this.userService.findByUsername(_username, true);
    if (!user) throw new NotFoundException('User not found');
    const isMatch = await user.checkPassword(_password);
    if (!isMatch) {
      throw new ForbiddenException('Username or password is incorrect');
    }
    if (user.status === UserStatusEum.NotActive) {
      throw new ForbiddenException('User is not active');
    }
    return {
      _id: user._id,
      username: user.username,
      roles: user.roles,
    };
  }
  async login(user: User) {
    const payload = user;
    const access_token = this.jwtService.sign(payload);
    return { payload, access_token };
  }


  async getMe(user: User) {
    const _user = await this.userService.findOne(user._id)
      .select(["_id", "roles", "status", "firstName", "lastName", "fullName", "emailAddress", "phoneNumber", "avatar"])

    return _user as User;
  }

  async registrationPhone(data: RegistrationDto) {
    // return await this.userService.create(data);
  }




  async verifyEmailRequest(data: TokenRequestEmailDto) {
    return await this.emailService.verifyRequest(data, useForEnum.User);
  }
  async verifyEmailConfirm(data: TokenConfirmEmailDto) {
    return await this.emailService.verifyConfirm(data, useForEnum.User);
  }
  // @
  async verifyPhoneRequest(data: TokenRequestPhoneDto) {
    return await this.phoneService.verifyRequest(data, useForEnum.User);
  }
  async verifyPhoneConfirm(data: TokenConfirmPhoneDto) {
    return await this.phoneService.verifyConfirm(data, useForEnum.User);
  }
  // @@
  async passwordResetRequest(data: PasswordResetRequestDto) {
    const { method, email, phone } = data;
    if (method === PasswordResetMethods.ByEmail) {
      await this.emailService.passwordResetRequest({ email });
    }
    if (method === PasswordResetMethods.ByPhone) {
      await this.phoneService.passwordResetRequest({ phone });
    }
    return true;
  }
  async passwordResetConfirm(data: PasswordResetConfirmDto) {
    const { method, email, phone, token, password } = data;
    let user: User;
    if (method === PasswordResetMethods.ByEmail) {
      const _email = await this.emailService.passwordResetConfirm({
        email,
        token,
      });
      user = _email.user;
    }
    if (method === PasswordResetMethods.ByPhone) {
      const _phone = await this.phoneService.passwordResetConfirm({
        phone,
        token,
      });
      user = _phone.user;
    }
    user.password = password;
    await user.save();
    return true;
  }
}
