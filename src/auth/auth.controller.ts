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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // =============================> login or register by phone & otp
  // *login or create
  @Post('phoneOtp')
  @Public()
  async phoneOtp(@Body() data: PhoneOtpDto) {
    console.log(data);

    // return this.authService.phoneOtp(data);
  }
  // *confirm & login
  @Post('loginByOtp')
  @Public()
  async loginByOtp(@Body() data: PhoneOtpConfirmDto) {
    return this.authService.loginByOtp(data);
  }
  // =============================> login or register by phone & otp



  // =============================> get user
  @Get()
  async getMe(@Request() { user }) {
    return this.authService.getMe(user);
  }
  // =============================> get user



}
