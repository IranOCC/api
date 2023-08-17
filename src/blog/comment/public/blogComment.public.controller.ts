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
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { WebBlogCommentFilteringDto, WebBlogCommentSortingDto, } from './dto/blogCommentQuery.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { BlogCommentPublicService } from './blogComment.public.service';
import { NewCommentDto } from './dto/newComment.dto';
import { MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';




@Public()
@Controller('blog/comment')
@ApiTags("BlogComment")
@ApiBearerAuth()
export class BlogCommentPublicController {
  constructor(private readonly blogCommentPublicService: BlogCommentPublicService) { }


  @Post(':id')
  @ApiOperation({ summary: "Add New comment", description: "No Description" })
  @ApiResponse({ status: 200 })
  create(@Param() { id: post }: MongoIDQueryDto, @Body() data: NewCommentDto, @Request() { user }) {
    return this.blogCommentPublicService.create(post, data, user);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get list of Model with filtering", description: "No Description" })
  @ApiResponse({ status: 200 })
  findAll(@Param() { id: post }: MongoIDQueryDto, @Query('filter') filter: WebBlogCommentFilteringDto, @Query('sort') sort: WebBlogCommentSortingDto, @Query() paginate: PaginationDto) {
    return this.blogCommentPublicService.findAll(post, paginate, filter, sort);
  }


}
