import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { Icon, IconDocument } from '../schemas/icon.schema';
import { CreateIconDto } from './dto/createIcon.dto';
import { UpdateIconDto } from './dto/updateIcon.dto';


@Injectable()
export class IconServiceAdmin {
  constructor(
    @InjectModel(Icon.name) private iconModel: Model<IconDocument>,
  ) { }


  // Create Icon
  create(data: CreateIconDto) {
    return this.iconModel.create(data);
  }

  // List Icon
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = []
    const project = "name content"
    const virtualFields = {}
    const searchFields = "name"
    return listAggregation(this.iconModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get Icon
  findOne(id: string) {
    return this.iconModel.findById(id).exec();
  }

  // Edit Icon
  update(id: string, data: UpdateIconDto) {
    return this.iconModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  // Remove Single Icon
  remove(id: string): Promise<DeleteResult> {
    return this.iconModel.deleteOne({ _id: id }).exec();
  }

  // Remove Bulk Icon
  bulkRemove(id: string[]) {
    return this.iconModel.deleteMany({ _id: { $in: id } });
  }
}
