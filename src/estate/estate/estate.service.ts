import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEstateDto } from './dto/createEstate.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';
import { EstateStatusEum } from './enum/estateStatus.enum';
import { EstateVisibilityEum } from './enum/estateVisibility.enum';
import { Estate, EstateDocument } from './schemas/estate.schema';
@Injectable()
export class EstateService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
  ) { }

  statics(subject: string) {
    return {
      status: EstateStatusEum,
      visibility: EstateVisibilityEum,
    }[subject]
  }


  create(data: CreateEstateDto) {
    this.estateModel.create(data);
  }

  update(id: string, data: UpdateEstateDto) {
    this.estateModel.updateOne({ _id: id }, data);
  }

  findAll() {
    return this.estateModel.find();
  }

  findOne(id: string) {
    return this.estateModel.findById(id);
  }

  remove(id: string) {
    this.estateModel.deleteOne({ _id: id });
  }
}