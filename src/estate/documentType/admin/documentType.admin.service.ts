import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { EstateDocumentType, EstateDocumentTypeDocument } from '../schemas/estateDocumentType.schema';
import { CreateEstateDocumentTypeDto } from './dto/createEstateDocumentType.dto';
import { UpdateEstateDocumentTypeDto } from './dto/updateEstateDocumentType.dto';



@Injectable()
export class EstateDocumentTypeAdminService {
  constructor(
    @InjectModel(EstateDocumentType.name) private estateDocumentTypeModel: Model<EstateDocumentTypeDocument>,
  ) { }


  // Create EstateDocumentType
  create(data: CreateEstateDocumentTypeDto) {
    return this.estateDocumentTypeModel.create(data);
  }

  // List EstateDocumentType
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["icons", "icon"],
      ["estatecategories", "categories", "title", true]
    ]
    const project = "title slug description tags"
    const virtualFields = {}
    const searchFields = "title slug description"
    return listAggregation(this.estateDocumentTypeModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get EstateDocumentType
  findOne(id: string) {
    return this.estateDocumentTypeModel.findById(id)
      .populate(["icon"])
      .exec();
  }

  // Edit EstateDocumentType
  update(id: string, data: UpdateEstateDocumentTypeDto) {
    return this.estateDocumentTypeModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single EstateDocumentType
  remove(id: string) {
    // TODO: remove other
    return this.estateDocumentTypeModel.deleteOne({ _id: id })
  }

  // Remove Bulk EstateDocumentType
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.estateDocumentTypeModel.deleteMany({ _id: { $in: id } })
  }
}


