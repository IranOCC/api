import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsBooleanString, IsEnum } from 'class-validator';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiNestedQuery } from 'src/utils/decorator/filterQuery.decorator';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { User } from '../schemas/user.schema';
import { UserFilteringDto, UserSortingDto } from './dto/userQuery.dto';
import { UserServiceAdmin } from './user.admin.service';











@Controller('admin/user')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerAdmin {
  constructor(private readonly userAdminService: UserServiceAdmin) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateUserDto, @Request() { user }, @Request() { offices }) {
    return this.userAdminService.create(data, { ...user, offices });
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: UserFilteringDto, @Query('sort') sort: UserSortingDto, @Query() paginate: PaginationDto) {
    return this.userAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.userAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateUserDto, @Request() { user }, @Request() { offices }) {
    return this.userAdminService.update(id, data, { ...user, offices });
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.userAdminService.remove(id, { ...user, offices });
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.userAdminService.bulkRemove(id, { ...user, offices });
  }
}
