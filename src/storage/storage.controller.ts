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

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) { }

  @Post("users")
  @Roles(RoleEnum.User)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsersFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "users", user)
  }

  @Post("offices")
  @Roles(RoleEnum.User)
  @UseInterceptors(FileInterceptor('file'))
  async uploadOfficesFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "offices", user)
  }

  @Post("estates")
  @Roles(RoleEnum.Agent)
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadEstatesFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "estates", user)
  }

  @Post("posts")
  @Roles(RoleEnum.Author)
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPostsFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "posts", user)
  }

  @Post("others")
  @Roles(RoleEnum.SuperAdmin)
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadOthersFiles(@UploadedFile() file: BufferedFile, @Request() { user }) {
    return this.storageService.upload(file, "others", user)
  }
}
