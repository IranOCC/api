import { Module } from '@nestjs/common';
import { MinioClientService } from './aws.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SharedIniFileCredentials } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { S3ManagerModule } from '../s3manager/s3manager.module';


@Module({
  imports: [
    S3ManagerModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: ConfigService) => {
          return {
            endpoint: configService.get('S3_API_ENDPOINT'),
            credentials: {
              secretAccessKey: configService.get('S3_SECRET_KEY'),
              accessKeyId: configService.get('S3_ACCESS_KEY'),
            },
          };
        },
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule { }
