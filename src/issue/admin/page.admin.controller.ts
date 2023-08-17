import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
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
import { CreatePageDto } from './dto/createPage.dto';
import { PageFilteringDto, PageSortingDto } from './dto/pageQuery.dto';
import { UpdatePageDto } from './dto/updatePage.dto';
import { PageAdminService } from './page.admin.service';





@Controller('admin/page')
@Roles(RoleEnum.SuperAdmin)
@ApiTags("Page")
@ApiBearerAuth()
export class PageAdminController {
  constructor(private readonly pageAdminService: PageAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreatePageDto, @Request() { user }, @Request() { offices }) {
    return this.pageAdminService.create(data, { ...user, offices });
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: PageFilteringDto, @Query('sort') sort: PageSortingDto, @Query() paginate: PaginationDto) {
    return this.pageAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.pageAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdatePageDto, @Request() { user }, @Request() { offices }) {
    return this.pageAdminService.update(id, data, { ...user, offices });
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.pageAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.pageAdminService.bulkRemove(id);
  }
}
