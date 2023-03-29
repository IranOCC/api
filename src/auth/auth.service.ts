import {
  ForbiddenException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private emailService: EmailService,
    private phoneService: PhoneService,
  ) { }

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

  async getMe(user: User) {
    console.log(user);
    return user;
  }

  async registration(data: RegistrationDto) {
    return await this.userService.create(data);
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
