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
  Query,
  NotAcceptableException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { CreateStorageDto } from './dto/createStorage.dto';
import { UploadFromUrlDto } from './dto/uploadFromUrl.dto';
import fetch from 'node-fetch';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { get } from 'https';
import { buffer } from 'stream/consumers';
import { Readable } from 'stream';





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
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadEstateGallery(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return this.storageService.create(image, user, RelatedToEnum.Estate, relatedToID, alt, title)
  }





  @Post("blog")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Author)
  @ApiOperation({ summary: "Upload blog post images", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadBlogPostImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return this.storageService.create(image, user, RelatedToEnum.Blog, relatedToID, alt, title)
  }







  @Post("page")
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: "Upload page images", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadPageImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { relatedToID, alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    return this.storageService.create(image, user, RelatedToEnum.Page, relatedToID, alt, title)
  }





  @Post("main")
  @Public()
  // @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Upload estate images", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadMain(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { alt, title }: CreateStorageDto,
    @Request() { user }
  ) {
    console.log(image, "image");

    return this.storageService.create(image, user, undefined, undefined, alt, title)
  }





  // =======> from url


  @Post("url")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Agent, RoleEnum.Author)
  @ApiOperation({ summary: "Upload from url", description: "No Description" })
  @ApiResponse({ status: 201 })
  async uploadImageFromUrl(
    @Body() { url, relatedTo, relatedToID, alt, title, }: UploadFromUrlDto,
    @Request() { user }
  ) {
    const data: Uint8Array[] = []
    return new Promise((resolve, reject) => {
      get(url, (result) => {
        result.on("data", (chunk: Uint8Array) => {
          data.push(chunk)
        })
        result.on("end", () => {
          const buffer = Buffer.concat(data)
          const image: Express.Multer.File = {
            buffer,
            fieldname: '',
            originalname: url.split("/").reverse()[0],
            encoding: '',
            mimetype: result.headers['content-type'],
            size: buffer.length,
            stream: new Readable,
            destination: '',
            filename: url.split("/").reverse()[0],
            path: url
          }
          resolve(this.storageService.create(image, user, relatedTo, relatedToID, alt, title))
        })
        result.on("error", () => {
          throw new NotAcceptableException("Cant Upload this file", "UploadErrorUrl")
        })
      })
    })
  }



}
