import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { CreateEstateDocumentTypeDto } from './dto/createEstateDocumentType.dto';
import { UpdateEstateDocumentTypeDto } from './dto/updateEstateDocumentType.dto';
import {
  EstateDocumentType,
  EstateDocumentTypeDocument,
} from './schemas/estateDocumentType.schema';

@Injectable()
export class EstateDocumentTypeService {
  constructor(
    @InjectModel(EstateDocumentType.name)
    private estateDocumentTypeModel: Model<EstateDocumentTypeDocument>,
  ) { }

  create(data: CreateEstateDocumentTypeDto) {
    return this.estateDocumentTypeModel.create(data);
  }

  findAll() {
    return this.estateDocumentTypeModel.find().populate(["icon", "categories"]).exec();
  }

  findOne(id: string) {
    return this.estateDocumentTypeModel.findById(id).populate(["icon", "categories"]).exec();
  }

  update(id: string, data: UpdateEstateDocumentTypeDto) {
    return this.estateDocumentTypeModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.estateDocumentTypeModel.deleteOne({ _id: id }).exec();
  }
}
