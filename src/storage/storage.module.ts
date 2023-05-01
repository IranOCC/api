import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Storage, StorageSchema } from './schemas/storage.schema';
import { S3ManagerModule } from './s3-manager/s3-manager.module';
import { S3 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    S3ManagerModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: ConfigService) => {
          return {
            endpoint: configService.get('S3_API_ENDPOINT'),
            accessKeyId: configService.get('S3_ACCESS_KEY'),
            secretAccessKey: configService.get('S3_SECRET_KEY'),
          }
        },
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      services: [S3],
    }),
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ],
  providers: [StorageService],
  controllers: [StorageController],
})
export class StorageModule { }


