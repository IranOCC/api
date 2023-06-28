import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { OfficeFilteringDto } from '../admin/dto/officeQuery.dto';
import { OfficeServiceTools } from './office.tools.service';



@Controller('tools/office')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeControllerTools {
  constructor(private readonly officeServiceTools: OfficeServiceTools) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query('filter') filter: OfficeFilteringDto, @Query() query: AutoCompleteDto) {
    return this.officeServiceTools.autoComplete(query, filter);
  }


  // ==================================================================================================> statics
  // @Get('statics/:subject')
  // @ApiOperation({ summary: "Get statics variables", description: "No Description" })
  // @ApiResponse({ status: 200 })
  // statics(@Param('subject') subject: string) {
  //   return this.userServiceTools.statics(subject);
  // }

}
