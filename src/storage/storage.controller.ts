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
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { BufferedFile } from './file.type';
import { Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) { }

  @Post("user")
  @Roles(RoleEnum.User)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsersFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "user", user)
  }

  @Post("office")
  @Roles(RoleEnum.Agent)
  @UseInterceptors(FileInterceptor('file'))
  async uploadOfficesFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "office", user)
  }

  @Post("estate")
  @Roles(RoleEnum.Agent)
  @UseInterceptors(FileInterceptor('file'))
  async uploadEstatesFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "estate", user)
  }

  @Post("post")
  @Roles(RoleEnum.Author)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPostsFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "post", user)
  }

  @Post("other")
  @Roles(RoleEnum.SuperAdmin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadOthersFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "other", user)
  }

  // ==
  @Get()
  findAll() {
    return this.storageService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.storageService.findOne(id);
  // }

  // @Delete(':id')
  // @Roles(RoleEnum.SuperAdmin)
  // remove(@Param('id') id: string) {
  //   return this.storageService.remove(id);
  // }

}
