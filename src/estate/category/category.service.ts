import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { CreateEstateCategoryDto } from './dto/createEstateCategory.dto';
import { UpdateEstateCategoryDto } from './dto/updateEstateCategory.dto';
import {
  EstateCategory,
  EstateCategoryDocument,
} from './schemas/estateCategory.schema';

@Injectable()
export class EstateCategoryService {
  constructor(
    @InjectModel(EstateCategory.name)
    private estateCategoryModel: Model<EstateCategoryDocument>,
  ) { }

  async assignList(id: string, search: string = "") {
    return (await this.estateCategoryModel
      .find(
        {
          _id: { $ne: id },
          title: { $regex: search }
        },
        { title: 1, value: 1 }
      )
      .limit(20)
    ).map((doc) => ({ title: doc.title, value: doc._id }))
  }


  create(data: CreateEstateCategoryDto) {
    return this.estateCategoryModel.create(data);
  }

  findAll() {
    return this.estateCategoryModel.find()
      .populate(["icon", "parent"])
      .exec();
  }

  findOne(id: string) {
    return this.estateCategoryModel.findById(id).populate(["icon", "parent"]).exec();

  }

  update(id: string, data: UpdateEstateCategoryDto) {
    return this.estateCategoryModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.estateCategoryModel.deleteOne({ _id: id }).exec();
  }
}


