import { Request, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { OfficeMemberFilteringDto } from '../dto/officeMemberQuery.dto';
import { OfficeMemberServiceTools } from './member.tools.service';
import { Public } from 'src/auth/guard/jwt-auth.guard';



@Controller('tools/office/:office_id/member')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeMemberControllerTools {
  constructor(private readonly officeMemberServiceTools: OfficeMemberServiceTools) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'office_id' })
  autoComplete(@Param('office_id') office_id: string, @Request() { user }, @Query('filter') filter: OfficeMemberFilteringDto, @Query() query: AutoCompleteDto) {
    return this.officeMemberServiceTools.autoComplete(query, filter, user, office_id,);
  }


  // ==================================================================================================> statics
  // @Get('statics/:subject')
  // @ApiOperation({ summary: "Get statics variables", description: "No Description" })
  // @ApiResponse({ status: 200 })
  // statics(@Param('subject') subject: string) {
  //   return this.userServiceTools.statics(subject);
  // }

}
