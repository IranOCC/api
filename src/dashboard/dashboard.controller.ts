import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';



@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  // ==================================================================================================> province autoComplete
  // @Get('province')
  // @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  // @ApiResponse({ status: 200 })
  // province(@Query('filter') filter: ProvinceFilteringDto, @Query() query: AutoCompleteDto) {
  //   return this.staticService.province(query, filter);
  // }


  // // ==================================================================================================> city autoComplete
  // @Get('city')
  // @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  // @ApiResponse({ status: 200 })
  // city(@Query('filter') filter: CityFilteringDto, @Query() query: AutoCompleteDto) {
  //   return this.staticService.city(query, filter);
  // }

}
