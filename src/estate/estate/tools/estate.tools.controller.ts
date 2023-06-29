import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { EstateToolsService } from './estate.tools.service';



@Controller('tools/estate')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiTags('Estate')
@ApiBearerAuth()
export class EstateToolsController {
  constructor(private readonly estateToolsService: EstateToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.estateToolsService.autoComplete(query);
  }

}
