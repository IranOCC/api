import { Module } from '@nestjs/common';
import { S3ManagerService } from './s3manager.service';

@Module({
    imports: [],
    providers: [S3ManagerService],
    exports: [S3ManagerService],
})
export class S3ManagerModule { }