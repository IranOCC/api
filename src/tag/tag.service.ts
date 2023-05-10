import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/createTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) { }


  create(data: CreateTagDto) {
    return this.tagModel.create(data);
  }

  findAll() {
    return this.tagModel.find().exec();
  }

  findOne(id: string) {
    return this.tagModel.findById(id).exec();
  }

  update(id: string, data: UpdateTagDto) {
    return this.tagModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.tagModel.deleteOne({ _id: id }).exec();
  }

  // 
  setTags(tags: string[],) {

  }
}
