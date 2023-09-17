import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Request,
  UploadedFiles,
  ParseFilePipeBuilder,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  HttpException,
  HttpStatus,
  Query
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StorageAdminService, } from './storage.admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { StorageFilteringDto, StorageSortingDto } from './dto/storageQuery.dto';
import { UpdateStorageDto } from '../dto/updateStorage.dto';






@Controller('admin/storage')
@ApiTags('Storage')
@ApiBearerAuth()
export class StorageAdminController {
  constructor(private storageAdminService: StorageAdminService) { }



  @Get()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: StorageFilteringDto, @Query('sort') sort: StorageSortingDto, @Query() paginate: PaginationDto, @Request() { user }) {
    console.log(user, "===========user============");
    return this.storageAdminService.findAll(paginate, filter, sort, user);
  }


  @Get(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.storageAdminService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateStorageDto) {
    return this.storageAdminService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.storageAdminService.remove(id);
  }

  @Delete()
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.storageAdminService.bulkRemove(id);
  }
}
