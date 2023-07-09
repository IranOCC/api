import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { SmsTemplateServiceTools, } from './sms_template.tools.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';



@Controller('tools/smsTemplate')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('SmsTemplate')
@ApiBearerAuth()
export class SmsTemplateControllerTools {
  constructor(private readonly smsTemplateServiceTools: SmsTemplateServiceTools) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.smsTemplateServiceTools.autoComplete(query);
  }

}
