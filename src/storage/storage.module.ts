import { Module } from '@nestjs/common';
import { MinioClientModule } from '../aws/aws.module';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Storage, StorageSchema } from './schemas/storage.schema';

@Module({
  imports: [
    MinioClientModule,
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ],
  providers: [StorageService],
  controllers: [StorageController],
})
export class StorageModule { }
