import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserServiceAdmin } from './user.admin.service';


@Controller('user/admin')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerAdmin {
  constructor(private readonly userAdminService: UserServiceAdmin) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateUserDto) {
    return this.userAdminService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200 })
  findAll(@Query() query: PaginationDto) {
    return this.userAdminService.findAll(query);
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
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateUserDto) {
    return this.userAdminService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.userAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    // return this.userAdminService.remove(id);
  }
}
