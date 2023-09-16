import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreateEstateDto } from './dto/createEstate.dto';
import { EstateFilteringDto, EstateSortingDto } from './dto/estateQuery.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';
import { EstateAdminService } from './estate.admin.service';




@Controller('admin/estate')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
@ApiTags("Estate")
@ApiBearerAuth()
export class EstateAdminController {
  constructor(private readonly estateAdminService: EstateAdminService) { }

  @Post()
  @ApiOperation({ summary: "Create new Model", description: "No Description" })
  @ApiResponse({ status: 201 })
  create(@Body() data: CreateEstateDto, @Request() { user }, @Request() { offices }) {
    return this.estateAdminService.create(data, { ...user, offices });
  }

  @Patch(':id')
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateEstateDto, @Request() { user }, @Request() { offices }) {
    return this.estateAdminService.update(id, data, { ...user, offices });
  }

  @Patch('confirm/:id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Confirm estate", description: "No Description" })
  @ApiResponse({ status: 201 })
  confirm(@Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.estateAdminService.confirmPublish(id, { ...user, offices });
  }

  @Patch('reject/:id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Reject estate", description: "No Description" })
  @ApiResponse({ status: 201 })
  reject(@Param() { id }: MongoIDQueryDto, @Query('reason') reason: string, @Request() { user }, @Request() { offices }) {
    return this.estateAdminService.rejectPublish(id, reason, { ...user, offices });
  }


  @Get()
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: EstateFilteringDto, @Query('sort') sort: EstateSortingDto, @Query() paginate: PaginationDto) {
    return this.estateAdminService.findAll(paginate, filter, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.estateAdminService.findOne(id);
  }



  @Delete(':id')
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.estateAdminService.remove(id, { ...user, offices });
  }

  @Delete()
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto, @Request() { user }, @Request() { offices }) {
    return this.estateAdminService.bulkRemove(id, { ...user, offices });
  }
}
