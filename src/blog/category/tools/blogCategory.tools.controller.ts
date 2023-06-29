import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { BlogCategoryToolsService, } from './blogCategory.tools.service';



@Controller('tools/blog/category')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiTags('BlogCategory')
@ApiBearerAuth()
export class BlogCategoryToolsController {
  constructor(private readonly blogPostToolsService: BlogCategoryToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.blogPostToolsService.autoComplete(query);
  }



}
