import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateIconDto } from './dto/createIcon.dto';
import { IconFilteringDto, IconSortingDto } from './dto/iconQuery.dto';
import { UpdateIconDto } from './dto/updateIcon.dto';
import { IconServiceAdmin } from './icon.admin.service';

@Controller('admin/icon')
@Roles(RoleEnum.SuperAdmin)
@ApiTags('Icon')
@ApiBearerAuth()
export class IconControllerAdmin {
  constructor(private readonly iconAdminService: IconServiceAdmin) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() createIconDto: CreateIconDto) {
    return this.iconAdminService.create(createIconDto);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: IconFilteringDto, @Query('sort') sort: IconSortingDto, @Query() paginate: PaginationDto) {
    return this.iconAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.iconAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() updateIconDto: UpdateIconDto) {
    return this.iconAdminService.update(id, updateIconDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.iconAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.iconAdminService.bulkRemove(id);
  }
}
