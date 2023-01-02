import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

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
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const isMatch = await user.checkPassword(_password);
    if (!isMatch) {
      throw new HttpException(
        'Username or password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
    if (user.status === UserStatusEum.NotActive) {
      throw new HttpException('User is not active', HttpStatus.FORBIDDEN);
    }
    return {
      _id: user._id,
      username: user.username,
      roles: user.roles,
    };
  }
  async login(user: User) {
    const payload = user;
    return {
      payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: User) {
    console.log(user);
    return true;
  }

  async passwordReset(data: PasswordResetDto) {
    this.smsService.welcome();
    return this.smsService.welcome();
    const { method, email, phone } = data;
    if (method === PasswordResetMethods.ByEmail) {
      const _email = await this.emailService.find(email);
      const token = this.emailService.generateToken(_email.secret);
      const user = await this.userService.findOne(_email.user);
      this.mailService.resetPassword(user, token);
    }
    if (method === PasswordResetMethods.ByPhone) {
      const _phone = await this.phoneService.find(phone);
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
      const _email = await this.emailService.checkValid({
        email,
        token,
      });
      user = await this.userService.findOne(_email.user);
    }
    if (method === PasswordResetMethods.ByPhone) {
      const _phone = await this.phoneService.checkValid({
        phone,
        token,
      });
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
    return await this.emailService.verify(data);
  }
  async verifyEmailResend(data: SendVerifyEmailDto) {
    return await this.emailService.verifyRequest(data);
  }
  async verifyPhone(data: VerifyPhoneDto) {
    return await this.phoneService.verify(data);
  }
  async verifyPhoneResend(data: SendVerifyPhoneDto) {
    return await this.phoneService.verifyRequest(data);
  }
}
