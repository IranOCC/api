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
import { CreateEstateFeatureDto } from './dto/createEstateFeature.dto';
import { EstateFeatureFilteringDto, EstateFeatureSortingDto } from './dto/estateFeatureQuery.dto';
import { UpdateEstateFeatureDto } from './dto/updateEstateFeature.dto';
import { EstateFeatureAdminService } from './feature.admin.service';



@Controller('admin/estate/feature')
@Roles(RoleEnum.SuperAdmin)
@ApiTags("EstateFeature")
@ApiBearerAuth()
export class EstateFeatureAdminController {
  constructor(private readonly estateFeatureAdminService: EstateFeatureAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateEstateFeatureDto) {
    return this.estateFeatureAdminService.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: EstateFeatureFilteringDto, @Query('sort') sort: EstateFeatureSortingDto, @Query() paginate: PaginationDto) {
    return this.estateFeatureAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.estateFeatureAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateEstateFeatureDto) {
    return this.estateFeatureAdminService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.estateFeatureAdminService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.estateFeatureAdminService.bulkRemove(id);
  }
}
