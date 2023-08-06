import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogPostPublicService } from './blogPost.public.service';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { WebBlogPostFilteringDto, WebBlogPostSortingDto } from './dto/blogPostQuery.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';




@Public()
@Controller('blog/post')
@ApiTags("BlogPost")
@ApiBearerAuth()
export class BlogPostPublicController {
  constructor(private readonly blogPostPublicService: BlogPostPublicService) { }


  @Get()
  @ApiOperation({ summary: "Get list of Model with filtering", description: "No Description" })
  @ApiResponse({ status: 200 })
  findAll(@Query('filter') filter: WebBlogPostFilteringDto, @Query('sort') sort: WebBlogPostSortingDto, @Query() paginate: PaginationDto) {
    return this.blogPostPublicService.findAll(paginate, filter, sort);
  }

  @Get(':id_or_slug')
  @ApiOperation({ summary: "Get single Model by id or slug", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOneBySlugOrID(@Param('id_or_slug') id_or_slug: string) {
    return this.blogPostPublicService.findOneBySlugOrID(id_or_slug);
  }
}
