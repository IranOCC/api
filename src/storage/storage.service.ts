import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { AWSService } from '../aws/aws.service';
// import { BufferedFile } from '../aws/file.model';
import { Storage, StorageDocument } from './schemas/storage.schema';
import { S3 } from 'aws-sdk';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { BufferedFile } from './file.type';
import { customAlphabet } from 'nanoid/non-secure'
import { User } from 'src/user/schemas/user.schema';
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz', 16)



@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private s3managerService: S3ManagerService,
  ) { }



  async upload(file: BufferedFile, subject: string, user: User) {
    const ext = "." + file.originalname.split('.').filter(Boolean).slice(1).join('.')
    const fileKey = subject + "/" + nanoid() + ext

    await this.s3managerService.upload(file, fileKey)

    const storage = await this.storageModel.create({
      title: file.originalname,
      alt: file.originalname,
      filesize: file.size,
      mimetype: file.mimetype,
      path: fileKey,
      subject: subject,
      uploadedBy: user,
    })

    return storage
  }


  async findAll() {
    return this.storageModel.find().exec()
    // .limit(perPage)
    // .skip(perPage * page)
    // .sort({
    //   createdAt: 'asc',
    // });
  }

  // async item(id: string) {
  //   return this.storageModel.findById(id);
  // }

  // async delete(id: string) {
  //   const storage = await this.storageModel.findOneAndDelete({ _id: id });
  //   // return await this.minioClientService.delete(
  //   //   storage.filename,
  //   //   storage.bucket,
  //   // );
  // }

  // async multipleDelete(id: Array<string>) {
  //   const storageList = await this.storageModel.find({ _id: { $in: id } });
  //   const fileList = [];
  //   let _bucket = '';
  //   if (storageList.length === 0) {
  //     throw new HttpException('Files is empty', HttpStatus.BAD_REQUEST);
  //   }
  //   storageList.forEach(({ filename, bucket }) => {
  //     fileList.push(filename);
  //     _bucket = bucket;
  //   });
  //   await this.storageModel.deleteMany({ _id: { $in: id } });
  //   // return await this.minioClientService.multipleDelete(fileList, _bucket);
  // }

  // async update(id: string) {
  //   const storage = await this.storageModel.findOne({ _id: id });
  //   return storage;
  // }
}
