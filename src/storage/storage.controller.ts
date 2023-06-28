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
import { StorageService } from './storage.service';
import { BufferedFile } from './file.type';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { StorageFilteringDto, StorageSortingDto } from './dto/storageQuery.dto';
import { MongoArrayIDQueryDto, MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';
import { CreateStorageDto } from './dto/createStorage.dto';
import { UpdateStorageDto } from './dto/updateStorage.dto';







export class UploadSingleImageDto extends CreateStorageDto {
  @ApiProperty({ type: 'string', isArray: false, format: 'binary', })
  image: any[];
}


export class UploadMultipleImageDto extends CreateStorageDto {
  @ApiProperty({ type: 'string', isArray: true, format: 'binary', })
  images: any[];
}


@Controller('storage')
@ApiTags('Storage')
@ApiBearerAuth()
export class StorageController {
  constructor(private storageService: StorageService) { }




  @Post("user/avatar")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author, RoleEnum.User)
  @ApiOperation({ summary: "Upload user avatar", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return this.storageService.create(image, user, RelatedToEnum.User, relatedToID, alt, title)
  }



  @Post("office/avatar")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Upload office avatar", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadOfficeAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return this.storageService.create(image, user, RelatedToEnum.Office, relatedToID, alt, title)
  }




  @Post("estate")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent)
  @ApiOperation({ summary: "Upload estate gallery", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  async uploadEstateGallery(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /\.(image\/jpeg|image\/jpg|image\/png)$/ }),
        ],
      }),
    )
    images: [Express.Multer.File],
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return images.map(image => {
      return this.storageService.create(image, user, RelatedToEnum.Estate, relatedToID, alt, title)
    });
  }


  @Post("blog")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Author)
  @ApiOperation({ summary: "Upload blog post", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /\.(image\/jpeg|image\/jpg|image\/png)$/ }),
        ],
      }),
    )
    images: [Express.Multer.File],
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return images.map(image => {
      return this.storageService.create(image, user, RelatedToEnum.Blog, relatedToID, alt, title)
    });
  }




  // ============


  @Get()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Get list of Model", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll(@Query('filter') filter: StorageFilteringDto, @Query('sort') sort: StorageSortingDto, @Query() paginate: PaginationDto) {
    return this.storageService.findAll(paginate, filter, sort);
  }


  @Get(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Get single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  findOne(@Param() { id }: MongoIDQueryDto) {
    return this.storageService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Edit single Model by id", description: "No Description" })
  @ApiResponse({ status: 201 })
  update(@Param() { id }: MongoIDQueryDto, @Body() data: UpdateStorageDto) {
    return this.storageService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Delete single Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  remove(@Param() { id }: MongoIDQueryDto) {
    return this.storageService.remove(id);
  }

  @Delete()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Delete bulk of Model by id", description: "No Description" })
  @ApiResponse({ status: 200 })
  bulkRemove(@Query() { id }: MongoArrayIDQueryDto) {
    return this.storageService.bulkRemove(id);
  }
}
