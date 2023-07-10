import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsBooleanString, IsEnum } from 'class-validator';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiNestedQuery } from 'src/utils/decorator/filterQuery.decorator';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateOfficeDto } from '../dto/createOffice.dto';
import { UpdateOfficeDto } from '../dto/updateOffice.dto';
import { OfficeFilteringDto, OfficeSortingDto } from './dto/officeQuery.dto';
import { OfficeServiceAdmin } from './office.admin.service';












@Controller('admin/office')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeControllerAdmin {
  constructor(private readonly officeAdminService: OfficeServiceAdmin) { }

  @Post()
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateOfficeDto) {
    return this.officeAdminService.create(data);
  }

  @Get()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: OfficeFilteringDto, @Query('sort') sort: OfficeSortingDto, @Query() paginate: PaginationDto) {
    return this.officeAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.officeAdminService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateOfficeDto) {
    return this.officeAdminService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.officeAdminService.remove(id);
  }

  @Delete()
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.officeAdminService.bulkRemove(id);
  }
}
