import { Body, Controller, Get, Query, Post, Request } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { GetSmsLogsDto } from '../phone/dto/getSmsLogs.dto';
import { SendSmsDto } from '../phone/dto/sendSms.dto';
import { PhoneService } from './phone.service';


@Controller('sms')
export class SmsController {
    constructor(
        private readonly phoneService: PhoneService
    ) { }


    @Post("send")
    @Roles(RoleEnum.Admin)
    send(@Body() data: SendSmsDto, @Request() { user }) {
        return this.phoneService.sendSms(data, user);
    }

    @Get("logs")
    @Roles(RoleEnum.Admin)
    logs(@Query() data: GetSmsLogsDto) {
        return this.phoneService.getSmsLogs(data);
    }
}
