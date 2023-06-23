import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhoneOtpResponseDto } from 'src/auth/dto/response/phoneOtp.dto';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { GetMailLogsDto } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';
import { EmailService } from './email.service';


@ApiTags('Mail')
@Controller('mail')
@Public()
export class MailController {

    constructor(
        private readonly emailService: EmailService
    ) { }


    @Post("send")
    // @Roles(RoleEnum.Admin)
    @ApiOperation({ summary: "Send single email to user", description: "Mail subject: (context.$subject or base on template)", })
    @ApiResponse({ status: 201 })
    send(@Body() data: SendMailDto, @Request() { user }) {
        return this.emailService.sendMail(data, user);
    }

    @Get("logs")
    // @Roles(RoleEnum.Admin)
    logs(@Query() data: GetMailLogsDto) {
        return this.emailService.getMailLogs(data);
    }
}
