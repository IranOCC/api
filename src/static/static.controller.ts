import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { StaticService } from './static.service';
import { CityFilteringDto, ProvinceFilteringDto } from './dto/staticQuery.dto';



@Controller('static')
@Public()
@ApiTags('Static')
@ApiBearerAuth()
export class StaticController {
  constructor(private readonly staticService: StaticService) { }


  // ==================================================================================================> province autoComplete
  @Get('province')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  province(@Query('filter') filter: ProvinceFilteringDto, @Query() query: AutoCompleteDto) {
    return this.staticService.province(query, filter);
  }


  // ==================================================================================================> city autoComplete
  @Get('city')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  city(@Query('filter') filter: CityFilteringDto, @Query() query: AutoCompleteDto) {
    return this.staticService.city(query, filter);
  }

}
