import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { EmailOtpDto } from './dto/emailOtp.dto';
import { EmailOtpConfirmDto } from './dto/emailOtpConfirm.dto';
import { PhoneOtpDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirmDto } from './dto/phoneOtpConfirm.dto';
import { UpdateMe } from './dto/updateMe.dto';
import { OfficeService } from 'src/office/office.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }



  // login or create
  async requestLogin(data: PhoneOtpDto | EmailOtpDto) {
    const byPhoneOtp = (data instanceof PhoneOtpDto)
    const byEmailOtp = (data instanceof EmailOtpDto)


    // find or create
    let user: User | null = null
    if (byPhoneOtp) user = await this.userService.findOrCreateByPhone(data);
    if (byEmailOtp) user = await this.userService.findOrCreateByEmail(data);
    if (!user?.active) throw new NotAcceptableException("Your account is inactive by management", "UserLoginInactive")


    // send otp
    if (byPhoneOtp) {
      try {
        await this.userService.sendPhoneOtpCode(user)
      } catch (error) {
        throw new NotAcceptableException("Send otp code failed", "SendOtpFailed")
      }
      return { phone: (user.phone as PhoneNumber).value };
    }
    if (byEmailOtp) {
      try {
        await this.userService.sendEmailOtpCode(user)
      } catch (error) {
        throw new NotAcceptableException("Send otp code failed", "SendOtpFailed")
      }
      return { email: (user.email as EmailAddress).value };
    }


    //
    throw new NotAcceptableException("Problem in login to account, try later", "UserLoginProblem")
  }


  // check confirm & login
  async confirmLogin(data: PhoneOtpConfirmDto | EmailOtpConfirmDto) {
    const byPhoneOtp = (data instanceof PhoneOtpConfirmDto)
    const byEmailOtp = (data instanceof EmailOtpConfirmDto)

    // find or create
    let user: User | null = null
    if (byPhoneOtp) user = await this.userService.findOrCreateByPhone({ phone: data.phone });
    if (byEmailOtp) user = await this.userService.findOrCreateByEmail({ email: data.email });
    if (!user?.active) throw new NotAcceptableException("Your account is inactive by management", "UserLoginInactive")

    // confirm otp
    if (byPhoneOtp) await this.userService.confirmPhoneOtpCode(user, data.token)
    if (byEmailOtp) await this.userService.confirmEmailOtpCode(user, data.token)

    // success login
    const payload = await this.userService.getUserPayload(user._id)
    const accessToken = this.jwtService.sign(payload.toJSON(), { expiresIn: "30d" });
    return {
      accessToken,
      user: {
        id: payload._id,
        _id: payload._id,
        roles: payload.roles,
      }
    };
  }




  // =============================> getMe
  async getMe(user: User) {
    const _user = await this.userService.getUserPayload(user._id)
    return _user as User;
  }
  // =============================> getMe



  // =============================> updateMe
  async updateMe(user: User, data: UpdateMe) {
    return await this.userService.updateMe(user._id, data)
  }
  // =============================> updateMe



}
