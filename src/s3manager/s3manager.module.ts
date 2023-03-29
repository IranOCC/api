import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { S3managerService } from './s3manager.service';

@Module({
    imports: [AwsSdkModule.forFeatures([S3])],
    providers: [S3managerService],
    exports: [S3managerService],
})

export class S3ManagerModule { }


