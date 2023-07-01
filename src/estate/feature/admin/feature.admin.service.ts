import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { EstateFeature, EstateFeatureDocument } from '../schemas/estateFeature.schema';
import { CreateEstateFeatureDto } from './dto/createEstateFeature.dto';
import { UpdateEstateFeatureDto } from './dto/updateEstateFeature.dto';




@Injectable()
export class EstateFeatureAdminService {
  constructor(
    @InjectModel(EstateFeature.name) private estateFeatureModel: Model<EstateFeatureDocument>,
  ) { }


  // Create EstateFeature
  create(data: CreateEstateFeatureDto) {
    return this.estateFeatureModel.create(data);
  }

  // List EstateFeature
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["icons", "icon"],
      ["estatecategories", "categories", "title", true]
    ]
    const project = "title slug description tags"
    const virtualFields = {}
    const searchFields = "title slug description"
    return listAggregation(this.estateFeatureModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get EstateFeature
  findOne(id: string) {
    return this.estateFeatureModel.findById(id)
      .populate(["icon",])
      .exec();
  }

  // Edit EstateFeature
  update(id: string, data: UpdateEstateFeatureDto) {
    return this.estateFeatureModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single EstateFeature
  remove(id: string) {
    // TODO: remove other
    return this.estateFeatureModel.deleteOne({ _id: id })
  }

  // Remove Bulk EstateFeature
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.estateFeatureModel.deleteMany({ _id: { $in: id } })
  }
}


