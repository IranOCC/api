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
import { PhoneService } from '../phone.service';
import { SendSmsDto } from '../dto/sendSms.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { SmsLogFilteringDto, SmsLogSortingDto } from './dto/smsLogQuery.dto';




@Controller('admin/sms')
@ApiTags('Sms')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiBearerAuth()
export class SmsController {
  constructor(private readonly phoneService: PhoneService) { }

  @Post()
  @ApiOperation({ summary: "Send single sms to phone number", description: "No Description" })
  @ApiResponse({ status: 200 })
  sendSingleSms(@Body() data: SendSmsDto, @Request() { user }) {
    return this.phoneService.sendSingleSms(data, user);
  }

  @Get()
  @ApiOperation({ summary: "Get list of sms logs", description: "No Description" })
  @ApiResponse({ status: 200 })
  listLogs(@Query('filter') filter: SmsLogFilteringDto, @Query('sort') sort: SmsLogSortingDto, @Query() paginate: PaginationDto) {
    return this.phoneService.getSmsLogs(paginate, filter, sort);
  }

}


