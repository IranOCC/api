import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { GetMailLogs } from '../email/dto/getMailLogs.dto';
import { SendMailDto } from '../email/dto/sendMail.dto';
import { EmailService } from '../email/email.service';

@Controller('mail')
export class MailController {

    constructor(
        private readonly emailService: EmailService
    ) { }


    @Post("send")
    @Roles(RoleEnum.Admin)
    send(@Body() data: SendMailDto, @Request() { user }) {
        return this.emailService.sendMail(data, user);
    }

    @Get("logs")
    @Roles(RoleEnum.Admin)
    logs(@Query() data: GetMailLogs) {
        return this.emailService.getMailLogs(data);
    }
}
