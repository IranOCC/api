import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserStatusEum } from 'src/user/enum/userStatus.enum';
import { User } from 'src/user/schemas/user.schema';

import { PasswordResetConfirmDto } from './dto/passwordResetConfirm.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { RegistrationDto } from './dto/registration.dto';

import { VerifyEmailDto } from 'src/email/dto/verifyEmail.dto';
import { SendVerifyEmailDto } from 'src/email/dto/sendVerifyEmail.dto';
import { VerifyPhoneDto } from 'src/phone/dto/verifyPhone.dto';
import { SendVerifyPhoneDto } from 'src/phone/dto/sendVerifyPhone.dto';

import { UserService } from '../user/user.service';
import { PhoneService } from 'src/phone/phone.service';
import { EmailService } from 'src/email/email.service';
import { PasswordResetMethods } from './enum/passwordResetMethod.enum';
import { SmsService } from 'src/sms/sms.service';
import { MailService } from 'src/mail/mail.service';
import { useForEnum } from './enum/useFor.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private phoneService: PhoneService,
    private emailService: EmailService,
    private smsService: SmsService,
    private mailService: MailService,
  ) {}

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

  async logout(user: User) {
    console.log(user);
    return true;
  }

  async passwordReset(data: PasswordResetDto) {
    // this.smsService.welcome();
    // return this.smsService.welcome();
    const { method, email, phone } = data;
    if (method === PasswordResetMethods.ByEmail) {
      const { token, query } = await this.emailService.requestToken(
        { email },
        useForEnum.User,
      );
      const user = await this.userService.findOne(query.user);
      this.mailService.resetPassword(user, token);
    }
    if (method === PasswordResetMethods.ByPhone) {
      const _phone = await this.phoneService.find(phone, useForEnum.User);
      const token = this.phoneService.generateToken(_phone.secret);
      const user = await this.userService.findOne(_phone.user);
      this.smsService.resetPassword(user, token);
    }
    return true;
  }

  async passwordResetConfirm(data: PasswordResetConfirmDto) {
    const { method, email, phone, token, password } = data;
    let user: User;
    if (method === PasswordResetMethods.ByEmail) {
      const _email = await this.emailService.checkValid(
        {
          email,
          token,
        },
        useForEnum.User,
      );
      user = await this.userService.findOne(_email.user);
    }
    if (method === PasswordResetMethods.ByPhone) {
      const _phone = await this.phoneService.checkValid(
        {
          phone,
          token,
        },
        useForEnum.User,
      );
      user = await this.userService.findOne(_phone.user);
    }
    user.password = password;
    await user.save();
    return true;
  }

  async registration(data: RegistrationDto) {
    return await this.userService.create(data);
  }

  async verifyEmail(data: VerifyEmailDto) {
    return await this.emailService.verify(data, useForEnum.User);
  }
  async verifyEmailResend(data: SendVerifyEmailDto) {
    return await this.emailService.verifyRequest(data, useForEnum.User);
  }
  async verifyPhone(data: VerifyPhoneDto) {
    return await this.phoneService.verify(data, useForEnum.User);
  }
  async verifyPhoneResend(data: SendVerifyPhoneDto) {
    return await this.phoneService.verifyRequest(data, useForEnum.User);
  }
}
