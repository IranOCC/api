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
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { BlogPostFilteringDto, BlogPostSortingDto } from './dto/blogPostQuery.dto';
import { CreateBlogPostDto } from './dto/createBlogPost.dto';
import { UpdateBlogPostDto } from './dto/updateBlogPost.dto';
import { BlogPostAdminService } from './blogPost.admin.service';





@Controller('admin/blog/post')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Author)
@ApiTags("BlogPost")
@ApiBearerAuth()
export class BlogPostAdminController {
  constructor(private readonly blogPostAdminService: BlogPostAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateBlogPostDto, @Request() { user }, @Request() { offices }) {
    return this.blogPostAdminService.create(data, { ...user, offices });
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateBlogPostDto, @Request() { user }, @Request() { offices }) {
    return this.blogPostAdminService.update(id, data, { ...user, offices });
  }

  @Patch('confirm/:id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Confirm post", description: "No Description" })
  @ApiResponse({ status: 201 })
  confirm(@Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.blogPostAdminService.confirmPublish(id, { ...user, offices });
  }

  @Patch('reject/:id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Reject post", description: "No Description" })
  @ApiResponse({ status: 201 })
  reject(@Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.blogPostAdminService.rejectPublish(id, { ...user, offices });
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: BlogPostFilteringDto, @Query('sort') sort: BlogPostSortingDto, @Query() paginate: PaginationDto) {
    return this.blogPostAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.blogPostAdminService.findOne(id);
  }



  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.blogPostAdminService.remove(id, { ...user, offices });
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.blogPostAdminService.bulkRemove(id, { ...user, offices });
  }
}
