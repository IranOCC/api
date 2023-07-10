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
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Query
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { CreateStorageDto } from './dto/createStorage.dto';




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






  @Post("office/logo")
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Upload office logo", description: "No Description" })
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
  @ApiOperation({ summary: "Upload estate images", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  async uploadEstateGallery(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10000000 }),
          // new FileTypeValidator({ fileType: /\.(image\/jpeg|image\/jpg|image\/png)$/ }),
        ],
      }),
    )
    images: [Express.Multer.File],
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    let result = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const f = await this.storageService.create(image, user, RelatedToEnum.Estate, relatedToID, alt, title)
      result.push(f)
    }
    return result
  }





  @Post("blog")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Author)
  @ApiOperation({ summary: "Upload blog post images", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10000000 }),
          // new FileTypeValidator({ fileType: /\.(image\/jpeg|image\/jpg|image\/png)$/ }),
        ],
      }),
    )
    images: [Express.Multer.File],
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    let result = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const f = await this.storageService.create(image, user, RelatedToEnum.Blog, relatedToID, alt, title)
      result.push(f)
    }
    return result
  }





  @Post("main")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Upload estate images", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  async uploadMain(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10000000 }),
          // new FileTypeValidator({ fileType: /\.(image\/jpeg|image\/jpg|image\/png)$/ }),
        ],
      }),
    )
    images: [Express.Multer.File],
    @Body() { alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    let result = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const f = await this.storageService.create(image, user, undefined, undefined, alt, title)
      result.push(f)
    }
    return result
  }



}
