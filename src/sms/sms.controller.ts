import { Body, Controller, Get, Query, Post, Request } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { GetSmsLogs } from 'src/phone/dto/getSmsLogs.dto';
import { SendSmsDto } from 'src/phone/dto/sendSms.dto';
import { PhoneService } from 'src/phone/phone.service';
import { RoleEnum } from 'src/user/enum/role.enum';


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
    logs(@Query() data: GetSmsLogs) {
        return this.phoneService.getSmsLogs(data);
    }
}
