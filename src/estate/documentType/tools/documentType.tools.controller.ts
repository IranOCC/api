import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { EstateDocumentTypeToolsService } from './documentType.tools.service';



@Controller('tools/estate/documentType')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiTags('EstateDocumentType')
@ApiBearerAuth()
export class EstateDocumentTypeToolsController {
  constructor(private readonly estateDocumentTypeToolsService: EstateDocumentTypeToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.estateDocumentTypeToolsService.autoComplete(query);
  }

}
