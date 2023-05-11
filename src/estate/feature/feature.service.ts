import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { CreateEstateFeatureDto } from './dto/createEstateFeature.dto';
import { UpdateEstateFeatureDto } from './dto/updateEstateFeature.dto';
import {
  EstateFeature,
  EstateFeatureDocument,
} from './schemas/estateFeature.schema';

@Injectable()
export class EstateFeatureService {
  constructor(
    @InjectModel(EstateFeature.name)
    private estateFeatureModel: Model<EstateFeatureDocument>,
  ) { }

  create(data: CreateEstateFeatureDto) {
    return this.estateFeatureModel.create(data);
  }

  findAll() {
    return this.estateFeatureModel.find().populate(["icon", "parent"]).exec();
  }

  findOne(id: string) {
    return this.estateFeatureModel.findById(id).populate(["icon", "parent"]).exec();
  }

  update(id: string, data: UpdateEstateFeatureDto) {
    return this.estateFeatureModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.estateFeatureModel.deleteOne({ _id: id }).exec();
  }



}
