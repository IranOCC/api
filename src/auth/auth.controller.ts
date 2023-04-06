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


  // ===============================

  // auth ===>
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() { user }) {
    return this.authService.login(user);
  }
  @Get()
  async getMe(@Request() { user }) {
    return this.authService.getMe(user);
  }

  // password ===>
  @Post('passwordReset/request')
  @Public()
  async passwordResetRequest(@Body() data: PasswordResetRequestDto) {
    return this.authService.passwordResetRequest(data);
  }
  @Post('passwordReset/confirm')
  @Public()
  async passwordResetConfirm(@Body() data: PasswordResetConfirmDto) {
    return this.authService.passwordResetConfirm(data);
  }

  // registration ===>
  @Post('registration/phone')
  @Public()
  async registrationPhone(@Body() data: RegistrationDto) {
    return this.authService.registrationPhone(data);
  }
  @Post('registration/complete')
  @Public()
  async registration(@Body() data: RegistrationDto) {
    return this.authService.registrationPhone(data);
  }

  // email ===>
  @Post('email/verifyConfirm')
  @Public()
  async verifyEmailConfirm(@Body() data: TokenConfirmEmailDto) {
    return this.authService.verifyEmailConfirm(data);
  }
  @Post('email/verifyRequest')
  @Public()
  async verifyEmailRequest(@Body() data: TokenRequestEmailDto) {
    return this.authService.verifyEmailRequest(data);
  }

  // phone ===>
  @Post('phone/verifyConfirm')
  @Public()
  async verifyPhoneConfirm(@Body() data: TokenConfirmPhoneDto) {
    return this.authService.verifyPhoneConfirm(data);
  }
  @Post('phone/verifyRequest')
  @Public()
  async verifyPhoneRequest(@Body() data: TokenRequestPhoneDto) {
    return this.authService.verifyPhoneRequest(data);
  }
}
