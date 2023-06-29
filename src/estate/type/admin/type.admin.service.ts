import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { EstateType, EstateTypeDocument } from '../schemas/estateType.schema';
import { CreateEstateTypeDto } from './dto/createEstateType.dto';
import { UpdateEstateTypeDto } from './dto/updateEstateType.dto';





@Injectable()
export class EstateTypeAdminService {
  constructor(
    @InjectModel(EstateType.name) private estateTypeModel: Model<EstateTypeDocument>,
  ) { }


  // Create EstateType
  create(data: CreateEstateTypeDto) {
    return this.estateTypeModel.create(data);
  }

  // List EstateType
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["icons", "icon"],
    ]
    const project = "title slug description tags"
    const virtualFields = {}
    const searchFields = "title slug description"
    return listAggregation(this.estateTypeModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get EstateType
  findOne(id: string) {
    return this.estateTypeModel.findById(id)
      .populate(["icon",])
      .exec();
  }

  // Edit EstateType
  update(id: string, data: UpdateEstateTypeDto) {
    return this.estateTypeModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single EstateType
  remove(id: string) {
    // TODO: remove other
    return this.estateTypeModel.deleteOne({ _id: id })
  }

  // Remove Bulk EstateType
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.estateTypeModel.deleteMany({ _id: { $in: id } })
  }
}


