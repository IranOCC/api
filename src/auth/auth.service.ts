import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { EmailOtpDto } from './dto/emailOtp.dto';
import { EmailOtpConfirmDto } from './dto/emailOtpConfirm.dto';
import { PhoneOtpDtoDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirmDto } from './dto/phoneOtpConfirm.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  // =============================> login or register by PHONE & otp
  // login or create
  async phoneOtp(data: PhoneOtpDtoDto) {
    // find or create 
    const user = await this.userService.findOrCreateByPhone(data);
    // send otp
    try {
      await this.userService.sendPhoneOtpCode(user)
    } catch (error) {
      throw new NotAcceptableException("Send otp code failed", "SendOtpFailed")
    }
    // return
    return { phone: user.phone.value };
  }

  // confirm & login
  async loginByPhoneOtp(data: PhoneOtpConfirmDto) {
    // confirm otp
    const user = await this.userService.findOrCreateByPhone({ phone: data.phone });
    await this.userService.confirmPhoneOtpCode(user, data.token)
    // get login
    const payload = (await this.userService.getUserPayload(user._id)).toJSON()
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRE_IN });
    return { accessToken };
  }
  // =============================> login or register by PHONE & otp







  // =============================> login or register by EMAIL & otp
  // login or create
  async emailOtp(data: EmailOtpDto) {
    // find or create 
    const user = await this.userService.findOrCreateByEmail(data);
    // send otp
    try {
      await this.userService.sendEmailOtpCode(user)
    } catch (error) {
      throw new NotAcceptableException("Send otp code failed", "SendOtpFailed")
    }
    // return
    return { email: user.email.value };
  }

  // confirm & login
  async loginByEmailOtp(data: EmailOtpConfirmDto) {
    // confirm otp
    const user = await this.userService.findOrCreateByEmail({ email: data.email });
    await this.userService.confirmEmailOtpCode(user, data.token)
    // get login
    const payload = (await this.userService.getUserPayload(user._id)).toJSON()
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRE_IN });
    return { accessToken };
  }
  // =============================> login or register by EMAIL & otp






  // =============================> getMe
  // * get user login
  async getMe(user: User) {
    const _user = await this.userService.getUserPayload(user._id)
    return _user as User;
  }
  // =============================> getMe



}
