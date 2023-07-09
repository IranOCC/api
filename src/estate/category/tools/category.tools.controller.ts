import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { EstateCategoryToolsService, } from './category.tools.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';



@Controller('tools/estate/category')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('EstateCategory')
@ApiBearerAuth()
export class EstateCategoryToolsController {
  constructor(private readonly estateCategoryToolsService: EstateCategoryToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.estateCategoryToolsService.autoComplete(query);
  }

}
