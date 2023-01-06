import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
  ) {}

  create(data: CreateEstateFeatureDto): Promise<any> {
    return this.estateFeatureModel.create(data);
  }

  findAll(): Promise<any> {
    return this.estateFeatureModel.find().exec();
  }

  findOne(id: string): Promise<any> {
    return this.estateFeatureModel.findById(id).exec();
  }

  update(id: string, data: UpdateEstateFeatureDto): Promise<any> {
    return this.estateFeatureModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<any> {
    return this.estateFeatureModel.deleteOne({ _id: id }).exec();
  }
}
