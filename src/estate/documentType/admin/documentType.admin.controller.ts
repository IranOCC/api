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
import { EstateDocumentTypeAdminService } from './documentType.admin.service';
import { CreateEstateDocumentTypeDto } from './dto/createEstateDocumentType.dto';
import { EstateDocumentTypeFilteringDto, EstateDocumentTypeSortingDto } from './dto/estateDocumentTypeQuery.dto';
import { UpdateEstateDocumentTypeDto } from './dto/updateEstateDocumentType.dto';


@Controller('admin/estate/documentType')
@Roles(RoleEnum.SuperAdmin)
@ApiTags("EstateDocumentType")
@ApiBearerAuth()
export class EstateDocumentTypeAdminController {
  constructor(private readonly estateDocumentTypeAdminService: EstateDocumentTypeAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateEstateDocumentTypeDto) {
    return this.estateDocumentTypeAdminService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: EstateDocumentTypeFilteringDto, @Query('sort') sort: EstateDocumentTypeSortingDto, @Query() paginate: PaginationDto) {
    return this.estateDocumentTypeAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.estateDocumentTypeAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateEstateDocumentTypeDto) {
    return this.estateDocumentTypeAdminService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.estateDocumentTypeAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.estateDocumentTypeAdminService.bulkRemove(id);
  }
}
