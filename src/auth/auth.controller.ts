import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { PasswordResetConfirmDto } from './dto/passwordResetConfirm.dto';
import { RegistrationDto } from './dto/registration.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { SendVerifyEmailDto as SendVerifyEmailDto } from '../email/dto/sendVerifyEmail.dto';
import { VerifyPhoneDto } from './dto/verifyPhone.dto';
import { SendVerifyPhoneDto } from '../phone/dto/sendVerifyPhone.dto';
import { Public } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // auth ===>

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Request() { user }) {
    return this.authService.login(user);
  }
  @Post('logout')
  async logout(@Request() { user }) {
    return this.authService.logout(user);
  }

  // password ===>
  @Post('password/reset')
  @Public()
  async passwordReset(@Body() data: PasswordResetDto) {
    return this.authService.passwordReset(data);
  }
  @Post('password/reset/confirm')
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
  @Post('email/verify')
  @Public()
  async verifyEmail(@Body() data: VerifyEmailDto) {
    return this.authService.verifyEmail(data);
  }
  @Post('email/sendVerify')
  @Public()
  async sendVerifyEmail(@Body() data: SendVerifyEmailDto) {
    return this.authService.verifyEmailResend(data);
  }

  // phone ===>
  @Post('phone/verify')
  @Public()
  async verifyPhone(@Body() data: VerifyPhoneDto) {
    return this.authService.verifyPhone(data);
  }
  @Post('phone/sendVerify')
  @Public()
  async sendVerifyPhone(@Body() data: SendVerifyPhoneDto) {
    return this.authService.verifyPhoneResend(data);
  }
}
