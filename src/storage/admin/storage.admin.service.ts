import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { Storage, StorageDocument } from '../schemas/storage.schema';
import { UpdateStorageDto } from '../dto/updateStorage.dto';
import { S3ManagerService } from '../s3-manager/s3-manager.service';
import { User } from 'src/user/schemas/user.schema';





@Injectable()
export class StorageAdminService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    private s3managerService: S3ManagerService,
  ) { }





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
  findAll(pagination: PaginationDto, filter: any, sort: any, user: User) {
    const populate: PopulatedType[] = [
      ["users", "uploadedBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
    ]
    const project = "title alt filesize mimetype dimensions path"
    const virtualFields = {}
    const searchFields = "title alt path"
    return listAggregation(this.storageModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }



  // Remove Single Storage
  async remove(id: string) {
    await this.storageModel.deleteOne({ _id: id })
    // TODO: remove file from storage
    this.s3managerService
    // TODO: remove from its dependencies
  }

  // Remove Bulk Storage
  async bulkRemove(id: string[]) {
    await this.storageModel.deleteMany({ _id: { $in: id } });
    // TODO: remove files from storage
    // TODO: remove from its dependencies
  }

}
