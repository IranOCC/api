import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
  ) {}

  create(data: CreateEstateDocumentTypeDto): Promise<any> {
    return this.estateDocumentTypeModel.create(data);
  }

  findAll(): Promise<any> {
    return this.estateDocumentTypeModel.find().exec();
  }

  findOne(id: string): Promise<any> {
    return this.estateDocumentTypeModel.findById(id).exec();
  }

  update(id: string, data: UpdateEstateDocumentTypeDto): Promise<any> {
    return this.estateDocumentTypeModel
      .findOneAndUpdate({ _id: id }, data)
      .exec();
  }

  remove(id: string): Promise<any> {
    return this.estateDocumentTypeModel.deleteOne({ _id: id }).exec();
  }
}
