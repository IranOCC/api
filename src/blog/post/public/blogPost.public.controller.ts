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




@Public()
@Controller('blog/post')
@ApiTags("BlogPost")
@ApiBearerAuth()
export class BlogPostPublicController {
  constructor(private readonly blogPostPublicService: BlogPostPublicService) { }

  @Get(':id_or_slug')
  @ApiOperation({ summary: "Get single Model by id or slug", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOneBySlugOrID(@Param('id_or_slug') id_or_slug: string) {
    return this.blogPostPublicService.findOneBySlugOrID(id_or_slug);
  }
}
