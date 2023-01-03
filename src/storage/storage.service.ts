import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MinioClientService } from '../minio/minio.service';
import { BufferedFile } from '../minio/file.model';
import { Storage, StorageDocument } from './schemas/storage.schema';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private minioClientService: MinioClientService,
  ) {}

  async list(perPage = 5, page = 1) {
    return this.storageModel
      .find()
      .limit(perPage)
      .skip(perPage * page)
      .sort({
        createdAt: 'asc',
      });
  }

  async item(id: string) {
    return this.storageModel.findById(id);
  }

  async upload(bucket: string, image: BufferedFile) {
    const file = await this.minioClientService.upload(bucket, image);
    const storage = await this.storageModel.create(file);
    return { storage };
  }

  async delete(id: string) {
    const storage = await this.storageModel.findOneAndDelete({ _id: id });
    return await this.minioClientService.delete(
      storage.filename,
      storage.bucket,
    );
  }

  async multipleDelete(id: Array<string>) {
    const storageList = await this.storageModel.find({ _id: { $in: id } });
    const fileList = [];
    let _bucket = '';
    if (storageList.length === 0) {
      throw new HttpException('Files is empty', HttpStatus.BAD_REQUEST);
    }
    storageList.forEach(({ filename, bucket }) => {
      fileList.push(filename);
      _bucket = bucket;
    });
    await this.storageModel.deleteMany({ _id: { $in: id } });
    return await this.minioClientService.multipleDelete(fileList, _bucket);
  }

  async update(id: string) {
    const storage = await this.storageModel.findOne({ _id: id });
    return storage;
  }
}
