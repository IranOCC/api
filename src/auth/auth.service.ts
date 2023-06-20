import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { PhoneOtpDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirmDto } from './dto/phoneOtpConfirm.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  // =============================> login or register by phone & otp
  // * login or create
  async phoneOtp(data: PhoneOtpDto) {
    // find or create 
    const user = await this.userService.findOrCreateByPhone(data);
    // send otp
    try {
      await this.userService.sendPhoneOtpCode(user)
    } catch (error) {
      throw new InternalServerErrorException({ message: JSON.stringify(error) })
    }
    // return
    return { phone: user.phone.value };
  }

  // * confirm & login
  async loginByOtp(data: PhoneOtpConfirmDto) {
    // confirm otp
    const user = await this.userService.findOrCreateByPhone({ phone: data.phone });
    await this.userService.confirmPhoneOtpCode(user, data.token)
    // get login
    const payload = (await this.userService.getUserPayload(user._id)).toJSON()
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRE_IN });
    return {
      user,
      accessToken
    };
  }
  // =============================> login or register by phone & otp



  // =============================> after login
  // * get user login
  async getMe(user: User) {
    const _user = await this.userService.getUserPayload(user._id)
    return _user as User;
  }
  // =============================> after login



}
