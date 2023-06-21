import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { GetMailLogsDto } from './dto/getMailLogs.dto';
import { SendMailDto } from './dto/sendMail.dto';
import { EmailService } from './email.service';


@ApiTags('Mail')
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
    logs(@Query() data: GetMailLogsDto) {
        return this.emailService.getMailLogs(data);
    }
}
