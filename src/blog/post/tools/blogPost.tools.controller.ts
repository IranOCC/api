import { Request, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { BlogPostToolsService } from './blogPost.tools.service';



@Controller('tools/blog/post')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
@ApiTags('BlogPost')
@ApiBearerAuth()
export class BlogPostToolsController {
  constructor(private readonly blogPostToolsService: BlogPostToolsService) { }


  // ==================================================================================================> autoComplete
  @Get('autoComplete')
  @ApiOperation({ summary: "Get Model list in autoComplete structure", description: "No Description" })
  @ApiResponse({ status: 200 })
  autoComplete(@Query() query: AutoCompleteDto) {
    return this.blogPostToolsService.autoComplete(query);
  }


  // ==================================================================================================> statics
  @Get('statics/:subject')
  @ApiOperation({ summary: "Get statics variables", description: "No Description" })
  @ApiResponse({ status: 200 })
  statics(@Param('subject') subject: string) {
    return this.blogPostToolsService.statics(subject);
  }


  // ==================================================================================================> checking
  // actions: create update findOne find remove
  @Get('checking/:action')
  @ApiOperation({ summary: "Checking ", description: "No Description" })
  @ApiResponse({ status: 200 })
  checking(@Request() { user }, @Request() { offices }, @Param('action') action: string, @Query('id') id?: string) {
    return this.blogPostToolsService.checking({ ...user, offices }, action, id);
  }

}
