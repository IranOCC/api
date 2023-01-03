import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // auth ===>
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() { user }) {
    return this.authService.login(user);
  }
  @Post('logout')
  async logout(@Request() { user }) {
    return this.authService.logout(user);
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
  @Post('registration')
  @Public()
  async registration(@Body() data: RegistrationDto) {
    return this.authService.registration(data);
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
