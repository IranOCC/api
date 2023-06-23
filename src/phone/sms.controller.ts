import { Body, Controller, Get, Query, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { GetSmsLogsDto } from '../phone/dto/getSmsLogs.dto';
import { SendSmsDto } from '../phone/dto/sendSms.dto';
import { PhoneService } from './phone.service';



@ApiTags('Sms')
@Controller('sms')
@Public()
export class SmsController {
    constructor(
        private readonly phoneService: PhoneService
    ) { }


    @Post("send")
    // @Roles(RoleEnum.Admin)
    @ApiOperation({ summary: "Send single sms to user", description: "No Description", })
    @ApiResponse({ status: 201 })
    send(@Body() data: SendSmsDto, @Request() { user }) {
        return this.phoneService.sendSms(data, user);
    }

    @Get("logs")
    // @Roles(RoleEnum.Admin)
    logs(@Query() data: GetSmsLogsDto) {
        return this.phoneService.getSmsLogs(data);
    }
}
