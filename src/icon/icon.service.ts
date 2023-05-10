import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { CreateIconDto } from './dto/createIcon.dto';
import { UpdateIconDto } from './dto/updateIcon.dto';
import { Icon, IconDocument } from './schemas/icon.schema';

@Injectable()
export class IconService {
  constructor(
    @InjectModel(Icon.name) private iconModel: Model<IconDocument>,
  ) { }


  create(data: CreateIconDto) {
    return this.iconModel.create(data);
  }

  findAll() {
    return this.iconModel.find().exec();
  }

  findOne(id: string) {
    return this.iconModel.findById(id).exec();
  }

  update(id: string, data: UpdateIconDto) {
    return this.iconModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.iconModel.deleteOne({ _id: id }).exec();
  }
}
