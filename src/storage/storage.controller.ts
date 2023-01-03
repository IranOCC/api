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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { BufferedFile } from '../minio/file.model';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get()
  async list() {
    return await this.storageService.list();
  }

  @Get(':id')
  async item(@Param('id') id: string) {
    return await this.storageService.item(id);
  }

  @Post(':bucket')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('bucket') bucket: string,
    @UploadedFile() file: BufferedFile,
  ) {
    return await this.storageService.upload(bucket, file);
  }

  @Delete()
  async multipleDelete(@Body('id') id: Array<string>) {
    return await this.storageService.multipleDelete(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.storageService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string) {
    return await this.storageService.update(id);
  }
}
