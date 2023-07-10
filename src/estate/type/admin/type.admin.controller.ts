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
import { CreateEstateTypeDto } from './dto/createEstateType.dto';
import { EstateTypeFilteringDto, EstateTypeSortingDto } from './dto/estateTypeQuery.dto';
import { UpdateEstateTypeDto } from './dto/updateEstateType.dto';
import { EstateTypeAdminService } from './type.admin.service';




@Controller('admin/estate/type')
@Roles(RoleEnum.SuperAdmin)
@ApiTags("EstateType")
@ApiBearerAuth()
export class EstateTypeAdminController {
  constructor(private readonly estateTypeAdminService: EstateTypeAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateEstateTypeDto) {
    return this.estateTypeAdminService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: EstateTypeFilteringDto, @Query('sort') sort: EstateTypeSortingDto, @Query() paginate: PaginationDto) {
    return this.estateTypeAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.estateTypeAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateEstateTypeDto) {
    return this.estateTypeAdminService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.estateTypeAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.estateTypeAdminService.bulkRemove(id);
  }
}
