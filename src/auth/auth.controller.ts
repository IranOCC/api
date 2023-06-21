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
import { PhoneOtpDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirmDto } from './dto/phoneOtpConfirm.dto';
import { EmailOtpDto } from './dto/emailOtp.dto';
import { EmailOtpConfirmDto } from './dto/emailOtpConfirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // =============================> login or register by phone & otp
  // *login or create
  @Post('phoneOtp')
  @Public()
  async phoneOtp(@Body() data: PhoneOtpDto) {
    return this.authService.phoneOtp(data);
  }
  // *confirm & login
  @Post('loginByPhoneOtp')
  @Public()
  async loginByPhoneOtp(@Body() data: PhoneOtpConfirmDto) {
    return this.authService.loginByPhoneOtp(data);
  }
  // =============================> login or register by phone & otp



  // =============================> login or register by email & otp
  // *login or create
  @Post('emailOtp')
  @Public()
  async emailOtp(@Body() data: EmailOtpDto) {
    return this.authService.emailOtp(data);
  }
  // *confirm & login
  @Post('loginByEmailOtp')
  @Public()
  async loginByEmailOtp(@Body() data: EmailOtpConfirmDto) {
    return this.authService.loginByEmailOtp(data);
  }
  // =============================> login or register by email & otp



  // =============================> get user
  @Get()
  async getMe(@Request() { user }) {
    return this.authService.getMe(user);
  }
  // =============================> get user



}
