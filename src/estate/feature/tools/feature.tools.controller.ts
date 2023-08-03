import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { EstateFeatureToolsService } from './feature.tools.service';
import { EstateFeatureFilteringDto } from '../admin/dto/estateFeatureQuery.dto';
import { Public } from 'src/auth/guard/jwt-auth.guard';



@Controller('tools/estate/feature')
@Public()
@ApiTags('EstateFeature')
@ApiBearerAuth()
export class EstateFeatureToolsController {
  constructor(private readonly estateFeatureToolsService: EstateFeatureToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query('filter') filter: EstateFeatureFilteringDto, @Query() query: AutoCompleteDto) {
    return this.estateFeatureToolsService.autoComplete(query, filter);
  }

}
