import { Body, Request, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { EstateToolsService } from './estate.tools.service';



@Controller('tools/estate')
@Public()
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

  // ==================================================================================================> totalPriceRange
  @Get('range/totalPrice')
  @ApiOperation({ summary: "Get Range of totalPrices", description: "No Description" })
  @ApiResponse({ status: 200 })
  totalPriceRange() {
    return this.estateToolsService.totalPriceRange();
  }

  // ==================================================================================================> priceRange
  @Get('range/price')
  @ApiOperation({ summary: "Get Range of prices", description: "No Description" })
  @ApiResponse({ status: 200 })
  priceRange() {
    return this.estateToolsService.priceRange();
  }

  // ==================================================================================================> areaRange
  @Get('range/area')
  @ApiOperation({ summary: "Get Range of areas", description: "No Description" })
  @ApiResponse({ status: 200 })
  areaRange() {
    return this.estateToolsService.areaRange();
  }


  // ==================================================================================================> autoComplete/province
  @Get('autoComplete/province')
  @ApiOperation({ summary: "Get province list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoCompleteProvince() {
    return this.estateToolsService.autoCompleteProvince();
  }

  // ==================================================================================================> autoComplete/city
  @Get('autoComplete/city')
  @ApiOperation({ summary: "Get city list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoCompleteCity(@Query('filter') { province }: any) {
    return this.estateToolsService.autoCompleteCity(province);
  }


  // ==================================================================================================> autoComplete/city
  @Get('autoComplete/district')
  @ApiOperation({ summary: "Get district list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoCompleteDistrict(@Query('filter') { province, city }: any) {
    return this.estateToolsService.autoCompleteDistrict(province, city);
  }


  // ==================================================================================================> statics
  @Get('statics/:subject')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Get statics variables", description: "No Description" })
  @ApiResponse({ status: 200 })
  statics(@Param('subject') subject: string) {
    return this.estateToolsService.statics(subject);
  }




  // ==================================================================================================> checking
  // actions: create update findOne find remove
  @Get('checking/:action')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Checking ", description: "No Description" })
  @ApiResponse({ status: 200 })
  checking(@Request() { user }, @Request() { offices }, @Param('action') action: string, @Query('id') id?: string) {
    return this.estateToolsService.checking({ ...user, offices }, action, id);
  }

}
