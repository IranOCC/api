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
import { PhoneOtpDtoResponseDto, PhoneOtpDtoRequestDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirmRequestDto, } from './dto/phoneOtpConfirm.dto';
import { EmailOtpDtoRequestDto, EmailOtpDtoResponseDto } from './dto/emailOtp.dto';
import { EmailOtpConfirmRequestDto } from './dto/emailOtpConfirm.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/userLoginResponse.dto';
import { NotAcceptableDto } from 'src/utils/dto/notAcceptable.dto';
import { BadRequestDto } from 'src/utils/dto/badRequest.dto';
import { ForbiddenDto } from 'src/utils/dto/forbidden.dto';
import { UnauthorizedDto } from 'src/utils/dto/unauthorized.dto';
import { GetMeResponseDto } from './dto/getMeResponse.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // =============================> login or register by phone & otp
  // *login or create
  @Post('phoneOtp')
  @Public()
  @ApiOperation({ summary: "Request for send otp phone", description: "No Description" })
  @ApiResponse({ status: 201, type: PhoneOtpDtoResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 406, type: NotAcceptableDto })
  async phoneOtp(@Body() data: PhoneOtpDtoRequestDto) {
    return this.authService.phoneOtp(data);
  }


  // *confirm & login
  @Post('loginByPhoneOtp')
  @Public()
  @ApiOperation({ summary: "Login by phone & otp token", description: "No Description" })
  @ApiResponse({ status: 201, type: UserLoginResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  async loginByPhoneOtp(@Body() data: PhoneOtpConfirmRequestDto) {
    return this.authService.loginByPhoneOtp(data);
  }
  // =============================> login or register by phone & otp



  // =============================> login or register by email & otp
  // *login or create
  @Post('emailOtp')
  @Public()
  @ApiOperation({ summary: "Request for send otp email", description: "No Description" })
  @ApiResponse({ status: 201, type: EmailOtpDtoResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 406, type: NotAcceptableDto })
  async emailOtp(@Body() data: EmailOtpDtoRequestDto) {
    return this.authService.emailOtp(data);
  }
  // *confirm & login
  @Post('loginByEmailOtp')
  @Public()
  @ApiOperation({ summary: "Login by email & otp token", description: "No Description" })
  @ApiResponse({ status: 201, type: UserLoginResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  async loginByEmailOtp(@Body() data: EmailOtpConfirmRequestDto) {
    return this.authService.loginByEmailOtp(data);
  }
  // =============================> login or register by email & otp



  // =============================> get user
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get Me (Current user login)", description: "No Description" })
  @ApiResponse({ status: 200, type: GetMeResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  async getMe(@Request() { user }) {
    return this.authService.getMe(user);
  }
  // =============================> get user



}
