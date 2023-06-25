import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Request,
  Query
} from '@nestjs/common';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { PhoneService } from './phone.service';
import { SendSmsDto } from './dto/sendSms.dto';
import { PhoneDto } from './dto/phone.dto';
import { GetSmsLogsDto } from './dto/getSmsLogs.dto';




@Controller('admin/phone')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiBearerAuth()
@ApiTags('Phone')
export class PhoneController {
  constructor(private phoneService: PhoneService) { }

  @Post()
  @ApiOperation({ summary: "Send single sms to phone number", description: "No Description" })
  @ApiResponse({ status: 201 })
  sendSingleSms(@Body() data: SendSmsDto, @Request() { user }) {
    return this.phoneService.sendSingleSms(data, user);
  }

  @Get()
  @ApiOperation({ summary: "Get list of sms logs", description: "No Description" })
  @ApiResponse({ status: 200 })
  listLogs(@Query() data: GetSmsLogsDto) {
    return this.phoneService.getSmsLogs(data);
  }

}


