import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { RoleEnum } from '../enum/role.enum';
import { UserServiceTools } from '../services/user.tools.service';
import { UserService } from '../user.service';

@Controller('user/tools')
// @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerTools {
  constructor(private readonly userServiceTools: UserServiceTools) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @Public()
  @ApiOperation({ summary: "Get autocomplete list of data", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.userServiceTools.autoComplete(query);
  }

  // ==================================================================================================> statics
  @Get('statics/:subject')
  @Public()
  @ApiOperation({ summary: "Get statics value", description: "No Description" })
  @ApiResponse({ status: 200 })
  statics(@Param('subject') subject: string) {
    return this.userServiceTools.statics(subject);
  }

}
