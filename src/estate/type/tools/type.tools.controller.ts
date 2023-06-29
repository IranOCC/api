import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { EstateTypeToolsService } from './type.tools.service';



@Controller('tools/estate/type')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiTags('EstateType')
@ApiBearerAuth()
export class EstateTypeToolsController {
  constructor(private readonly estateTypeToolsService: EstateTypeToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.estateTypeToolsService.autoComplete(query);
  }

}
