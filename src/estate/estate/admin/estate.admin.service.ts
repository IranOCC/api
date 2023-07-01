import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { Estate, EstateDocument } from '../schemas/estate.schema';
import { CreateEstateDto } from './dto/createEstate.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';



@Injectable()
export class EstateAdminService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
  ) { }


  // Create Estate
  create(data: CreateEstateDto) {
    return this.estateModel.create(data);
  }

  // List Estate
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "owner", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["estatecategories", "category", "title"]
    ]
    const project = "title slug publishedAt status code"
    const virtualFields = {}
    const searchFields = "title slug excerpt content"
    return listAggregation(this.estateModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get Estate
  findOne(id: string) {
    return this.estateModel.findById(id)
      // .populate(["icon", "parent"])
      .exec();
  }

  // Edit Estate
  update(id: string, data: UpdateEstateDto) {
    return this.estateModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single Estate
  remove(id: string) {
    // TODO: remove other
    return this.estateModel.deleteOne({ _id: id })
  }

  // Remove Bulk Estate
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.estateModel.deleteMany({ _id: { $in: id } })
  }
}


