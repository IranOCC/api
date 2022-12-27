/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioService');
  }

  private readonly logger: Logger;
  private readonly defaultBucket = process.env.MINIO_FILES_BUCKET;

  public get client() {
    return this.minio.client;
  }

  public async upload(
    bucketName: string = this.defaultBucket,
    file: BufferedFile,
  ) {
    if (!file)
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    // generate file name
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      originalname: file.originalname,
    };
    const fileName = hashedFileName + extension;

    return new Promise((resolve, reject) => {
      this.client.putObject(
        bucketName,
        fileName,
        file.buffer,
        metaData,
        function (err: any, res: any) {
          if (err) {
            throw new HttpException('Upload failed', HttpStatus.BAD_REQUEST);
          }
          return resolve({
            title: file.originalname,
            bucket: bucketName,
            filename: fileName,
            filesize: file.size,
            mimetype: file.mimetype,
          });
        },
      );
    });
  }

  async delete(objetName: string, bucketName: string = this.defaultBucket) {
    return new Promise((resolve, reject) => {
      this.client.removeObject(
        bucketName,
        objetName,
        function (err: any, res: any) {
          if (err) {
            throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
          }
          resolve(true);
        },
      );
    });
  }

  async multipleDelete(
    objetList: Array<string>,
    bucketName: string = this.defaultBucket,
  ) {
    return new Promise((resolve, reject) => {
      this.client.removeObjects(
        bucketName,
        objetList,
        function (err: any, res: any) {
          if (err) {
            throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
          }
          resolve(true);
        },
      );
    });
  }
}
