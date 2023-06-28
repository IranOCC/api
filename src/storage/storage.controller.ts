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
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { BufferedFile } from './file.type';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiPropertyOptional, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListResponseDto } from 'src/utils/dto/pagination.dto';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';

export class UploadDataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  relatedToID: string;
}

export class UploadSingleImageDto extends UploadDataDto {
  @ApiProperty({ type: 'string', isArray: false, format: 'binary', })
  image: any[];
}


export class UploadMultipleImageDto extends UploadDataDto {
  @ApiProperty({ type: 'string', isArray: true, format: 'binary', })
  images: any[];
}





@Public()
@Controller('storage')
@ApiTags('Storage')
@ApiBearerAuth()
export class StorageController {
  constructor(private storageService: StorageService) { }




  @Post("user/avatar")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: "Upload user avatar", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadSingleImageDto })
  @UseInterceptors(FileInterceptor('image'))
  async uploadUserAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /image\/jpeg|image\/jpg|image\/png$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() { relatedToID, alt, title }: UploadDataDto,
    @Request() { user }
  ) {
    return this.storageService.upload(image, user, RelatedToEnum.User, relatedToID, alt, title)
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
    @Body() { relatedToID, alt, title }: UploadDataDto,
    @Request() { user }
  ) {
    return this.storageService.upload(image, user, RelatedToEnum.Office, relatedToID, alt, title)
  }


  @Post("estate/gallery")
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
    @Body() { relatedToID, alt, title }: UploadDataDto,
    @Request() { user }
  ) {
    return images.map(image => {
      return this.storageService.upload(image, user, RelatedToEnum.Estate, relatedToID, alt, title)
    });
  }


  @Post("blog/post")
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Author)
  @ApiOperation({ summary: "Upload blog post", description: "No Description" })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultipleImageDto })
  @UseInterceptors(FilesInterceptor('images'))
  async uploadPostGallery(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: /\.(image\/jpeg|image\/jpg|image\/png)$/ }),
        ],
      }),
    )
    images: [Express.Multer.File],
    @Body() { relatedToID, alt, title }: UploadDataDto,
    @Request() { user }
  ) {
    return images.map(image => {
      return this.storageService.upload(image, user, RelatedToEnum.Blog, relatedToID, alt, title)
    });
  }







  @Get()
  @ApiOperation({ summary: "Get list of files", description: "No Description" })
  @ApiResponse({ status: 200, type: ListResponseDto })
  findAll() {
    return this.storageService.findAll();
  }



}
