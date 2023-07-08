import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { BlogCommentAdminService } from './blogComment.admin.service';
import { BlogCommentFilteringDto, BlogCommentSortingDto } from './dto/blogCommentQuery.dto';
import { CreateBlogCommentDto } from './dto/createBlogComment.dto';
import { UpdateBlogCommentDto } from './dto/updateBlogComment.dto';






@Controller('admin/blog/comment')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Author)
@ApiTags("BlogComment")
@ApiBearerAuth()
export class BlogCommentAdminController {
  constructor(private readonly blogCommentAdminService: BlogCommentAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateBlogCommentDto) {
    return this.blogCommentAdminService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: BlogCommentFilteringDto, @Query('sort') sort: BlogCommentSortingDto, @Query() paginate: PaginationDto) {
    return this.blogCommentAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.blogCommentAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateBlogCommentDto) {
    return this.blogCommentAdminService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.blogCommentAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.blogCommentAdminService.bulkRemove(id);
  }
}
