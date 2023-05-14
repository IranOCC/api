import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { CreateEstateTypeDto } from './dto/createEstateType.dto';
import { UpdateEstateTypeDto } from './dto/updateEstateType.dto';
import {
  EstateType,
  EstateTypeDocument,
} from './schemas/estateType.schema';

@Injectable()
export class EstateTypeService {
  constructor(
    @InjectModel(EstateType.name)
    private estateTypeModel: Model<EstateTypeDocument>,
  ) { }

  create(data: CreateEstateTypeDto) {
    return this.estateTypeModel.create(data);
  }

  findAll() {
    return this.estateTypeModel.find().populate(["icon", "categories"]).exec();
  }

  findOne(id: string) {
    return this.estateTypeModel.findById(id).populate(["icon", "categories"]).exec();
  }

  update(id: string, data: UpdateEstateTypeDto) {
    return this.estateTypeModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.estateTypeModel.deleteOne({ _id: id }).exec();
  }


  // 

  async assignList(cat: string[], search: string = "") {
    const $query = {
      $or: [
        {
          categories: { $size: 0 },
        },
        {
          categories: { $in: cat },
        }
      ]
    }
    return (await this.estateTypeModel
      .find(
        {
          title: { $regex: search },
          ...$query
        },
        { title: 1, value: 1 }
      )
    ).map((doc) => ({ title: doc.title, value: doc._id }))
  }
}
