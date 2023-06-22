import {
  Controller,
  Post,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './jwt-auth.guard';
import { PhoneOtpDtoDto } from './dto/phoneOtp.dto';
import { PhoneOtpConfirmDto, } from './dto/phoneOtpConfirm.dto';
import { EmailOtpDto } from './dto/emailOtp.dto';
import { EmailOtpConfirmDto } from './dto/emailOtpConfirm.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/response/userLogin.dto';
import { UnauthorizedResponseDto } from 'src/utils/dto/response/unauthorized.dto';
import { GetMeResponseDto } from './dto/response/getMe.dto';
import { EmailOtpResponseDto } from './dto/response/emailOtp.dto';
import { PhoneOtpResponseDto } from './dto/response/phoneOtp.dto';
import { BadRequestResponseDto } from 'src/utils/dto/response/badRequest.dto';
import { ForbiddenResponseDto } from 'src/utils/dto/response/forbidden.dto';
import { NotAcceptableResponseDto } from 'src/utils/dto/response/notAcceptable.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // =============================> login or register by phone & otp
  // login or create
  @Post('phoneOtp')
  @Public()
  @ApiOperation({ summary: "Request for send otp phone", description: "No Description" })
  @ApiResponse({ status: 201, type: PhoneOtpResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 406, type: NotAcceptableResponseDto })
  async phoneOtp(@Body() data: PhoneOtpDtoDto) {
    return this.authService.phoneOtp(data);
  }


  // confirm & login
  @Post('loginByPhoneOtp')
  @Public()
  @ApiOperation({ summary: "Login by phone & otp token", description: "No Description" })
  @ApiResponse({ status: 201, type: UserLoginResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 403, type: ForbiddenResponseDto })
  async loginByPhoneOtp(@Body() data: PhoneOtpConfirmDto) {
    return this.authService.loginByPhoneOtp(data);
  }
  // =============================> login or register by phone & otp



  // =============================> login or register by email & otp
  // login or create
  @Post('emailOtp')
  @Public()
  @ApiOperation({ summary: "Request for send otp email", description: "No Description" })
  @ApiResponse({ status: 201, type: EmailOtpResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 406, type: NotAcceptableResponseDto })
  async emailOtp(@Body() data: EmailOtpDto) {
    return this.authService.emailOtp(data);
  }


  // confirm & login
  @Post('loginByEmailOtp')
  @Public()
  @ApiOperation({ summary: "Login by email & otp token", description: "No Description" })
  @ApiResponse({ status: 201, type: UserLoginResponseDto })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 403, type: ForbiddenResponseDto })
  async loginByEmailOtp(@Body() data: EmailOtpConfirmDto) {
    return this.authService.loginByEmailOtp(data);
  }
  // =============================> login or register by email & otp



  // =============================> get me
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get me (current user login)", description: "No Description" })
  @ApiResponse({ status: 200, type: GetMeResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  async getMe(@Request() { user }) {
    return this.authService.getMe(user)
  }
  // =============================> get me

}
