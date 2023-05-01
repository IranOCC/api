import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

import { PasswordResetRequestDto } from './dto/passwordResetRequest.dto';
import { PasswordResetConfirmDto } from './dto/passwordResetConfirm.dto';
import { RegistrationDto } from './dto/registration.dto';
import { TokenConfirmEmailDto } from '../email/dto/tokenConfirmEmail.dto';
import { TokenRequestEmailDto } from '../email/dto/tokenRequestEmail.dto';
import { TokenConfirmPhoneDto } from '../phone/dto/tokenConfirmPhone.dto';
import { TokenRequestPhoneDto } from '../phone/dto/tokenRequestPhone.dto';
import { PhoneOtpDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirm } from './dto/phoneOtpConfirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // login or create ===>
  @Post('phoneOtp')
  @Public()
  async phoneOtp(@Body() data: PhoneOtpDto) {
    return this.authService.phoneOtp(data);
  }

  // loginByOtp
  @Post('loginByOtp')
  @Public()
  async loginByOtp(@Body() data: PhoneOtpConfirm) {
    return this.authService.loginByOtp(data);
  }


  @Get()
  async getMe(@Request() { user }) {
    return this.authService.getMe(user);
  }


  // ===============================

  // auth ===>



}
