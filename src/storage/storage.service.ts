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
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz', 16)



@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private s3managerService: S3ManagerService,
  ) { }



  async upload(file: Express.Multer.File, user?: User, relatedTo?: RelatedToEnum, relatedToID?: string, alt?: string, title?: string) {
    const ext = "." + file.originalname.split('.').filter(Boolean).slice(1).join('.')
    const fileKey = relatedTo + "/" + nanoid() + ext

    await this.s3managerService.upload(file, fileKey)

    const storage = await this.storageModel.create({
      title: title || file.originalname,
      alt: alt || file.originalname,
      filesize: file.size,
      mimetype: file.mimetype,
      path: fileKey,
      relatedTo: relatedTo || undefined,
      relatedToID: relatedToID || undefined,
      uploadedBy: user?._id || undefined
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

}
