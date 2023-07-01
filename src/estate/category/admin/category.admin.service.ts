import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { EstateCategory, EstateCategoryDocument } from '../schemas/estateCategory.schema';
import { CreateEstateCategoryDto } from './dto/createEstateCategory.dto';
import { UpdateEstateCategoryDto } from './dto/updateEstateCategory.dto';


@Injectable()
export class EstateCategoryAdminService {
  constructor(
    @InjectModel(EstateCategory.name) private estateCategoryModel: Model<EstateCategoryDocument>,
  ) { }


  // Create EstateCategory
  create(data: CreateEstateCategoryDto) {
    return this.estateCategoryModel.create(data);
  }

  // List EstateCategory
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["icons", "icon"],
      ["estatecategories", "parent"]
    ]
    const project = "title slug description tags"
    const virtualFields = {}
    const searchFields = "title slug description"
    return listAggregation(this.estateCategoryModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get EstateCategory
  findOne(id: string) {
    return this.estateCategoryModel.findById(id)
      .populate(["icon"])
      .exec();
  }

  // Edit EstateCategory
  update(id: string, data: UpdateEstateCategoryDto) {
    return this.estateCategoryModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single EstateCategory
  remove(id: string) {
    // TODO: remove other
    return this.estateCategoryModel.deleteOne({ _id: id })
  }

  // Remove Bulk EstateCategory
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.estateCategoryModel.deleteMany({ _id: { $in: id } })
  }
}


