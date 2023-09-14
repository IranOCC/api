// s3-manager.service.ts
import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { BufferedFile } from '../file.type';

@Injectable()
export class S3ManagerService {
    constructor(
        @InjectAwsService(S3) private readonly s3: S3,
    ) {
    }


    async upload(file: Express.Multer.File, key: string) {
        await this.s3.upload({
            Bucket: process.env.S3_BUCKET,
            ContentType: file.mimetype,
            ContentEncoding: file.encoding,
            ContentLength: file.size,
            Key: key,
            Body: file.buffer,
        }).promise();
    }


    async remove(key: string) {
        // await this.s3.deleteObjects().promise();
    }
}