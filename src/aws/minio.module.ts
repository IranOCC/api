import { Module } from '@nestjs/common';
import { MinioClientService } from './minio.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';

import { AwsSdkModule } from 'nest-aws-sdk';
import { SharedIniFileCredentials } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { S3ManagerModule } from '../s3manager/s3manager.module';


@Module({
  imports: [
    S3ManagerModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useValue: {
          region: 'us-east-1',
          credentials: new SharedIniFileCredentials({
            profile: 'my-profile',
          }),
        },
      },
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule { }
