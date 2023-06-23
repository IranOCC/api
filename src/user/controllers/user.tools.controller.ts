import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { UserServiceTools } from '../services/user.tools.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
@Controller('user/tools')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerTools {
  constructor(private readonly userServiceTools: UserServiceTools) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.userServiceTools.autoComplete(query);
  }

  // ==================================================================================================> statics
  @Get('statics/:subject')
  @ApiOperation({ summary: "Get statics variables", description: "No Description" })
  @ApiResponse({ status: 200 })
  statics(@Param('subject') subject: string) {
    return this.userServiceTools.statics(subject);
  }

}
