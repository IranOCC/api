import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Storage, StorageDocument } from './schemas/storage.schema';
import { S3ManagerService } from './s3-manager/s3-manager.service';
import { customAlphabet } from 'nanoid/non-secure'
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { UpdateStorageDto } from './dto/updateStorage.dto';



const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz', 16)



@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private s3managerService: S3ManagerService,
  ) { }


  // Create Storage
  async create(file: Express.Multer.File, user?: User, relatedTo: RelatedToEnum = RelatedToEnum.Unspecific, relatedToID?: string, alt?: string, title?: string) {
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


  // Edit Storage
  async update(id: string, data: UpdateStorageDto): Promise<any> {
    return this.storageModel.updateOne({ _id: id }, data).exec();
  }



  // Get Storage
  findOne(id: string) {
    return this.storageModel.findById(id)
      .populate("uploadedBy", "firstName lastName")
  }


  // List Storage
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = []
    const project = "title alt filesize mimetype dimensions path"
    const virtualFields = {
      // fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = "title alt path"
    console.log(filter);

    return listAggregation(this.storageModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }



  // Remove Single Storage
  async remove(id: string) {
    await this.storageModel.deleteOne({ _id: id })
    // TODO: remove file from storage
    // TODO: remove from its dependencies
  }

  // Remove Bulk Storage
  async bulkRemove(id: string[]) {
    await this.storageModel.deleteMany({ _id: { $in: id } });
    // TODO: remove files from storage
    // TODO: remove from its dependencies
  }

}
