import { Request, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { UserServiceTools } from './user.tools.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { UserFilteringDto } from '../admin/dto/userQuery.dto';



@Controller('tools/user')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerTools {
  constructor(private readonly userServiceTools: UserServiceTools) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query('filter') filter: UserFilteringDto, @Query() query: AutoCompleteDto) {
    return this.userServiceTools.autoComplete(query, filter);
  }


  // ==================================================================================================> statics
  @Get('statics/:subject')
  @ApiOperation({ summary: "Get statics variables", description: "No Description" })
  @ApiResponse({ status: 200 })
  statics(@Param('subject') subject: string) {
    return this.userServiceTools.statics(subject);
  }


  // ==================================================================================================> checking
  // actions: create update findOne find remove
  @Get('checking/:action')
  @ApiOperation({ summary: "Checking ", description: "No Description" })
  @ApiResponse({ status: 200 })
  checking(@Request() { user }, @Request() { offices }, @Param('action') action: string, @Query('id') id?: string) {
    return this.userServiceTools.checking({ ...user, offices }, action, id);
  }

}
