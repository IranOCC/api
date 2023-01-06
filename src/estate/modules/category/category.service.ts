import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
  ) {}

  create(data: CreateEstateCategoryDto): Promise<any> {
    return this.estateCategoryModel.create(data);
  }

  findAll(): Promise<any> {
    return this.estateCategoryModel.find().exec();
  }

  findOne(id: string): Promise<any> {
    return this.estateCategoryModel.findById(id).exec();
  }

  update(id: string, data: UpdateEstateCategoryDto): Promise<any> {
    return this.estateCategoryModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<any> {
    return this.estateCategoryModel.deleteOne({ _id: id }).exec();
  }
}
