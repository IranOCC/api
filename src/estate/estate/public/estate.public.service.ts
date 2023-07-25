import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Estate, EstateDocument } from '../schemas/estate.schema';
import { EstateStatusEnum } from '../enum/estateStatus.enum';
import { EstateVisibilityEnum } from '../enum/estateVisibility.enum';




@Injectable()
export class EstatePublicService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
  ) { }


  // Get BlogPost
  findOneBySlugOrID(id_or_slug: string) {
    let query = ObjectId.isValid(id_or_slug) ? { _id: new ObjectId(id_or_slug) } : { slug: id_or_slug }
    query["status"] = EstateStatusEnum.Publish
    query["visibility"] = EstateVisibilityEnum.Public
    query["isConfirmed"] = true
    query["publishedAt"] = { $lte: Date.now() }

    return this.estateModel.findOne(query)
      .populate("category", "title slug")
      .populate("image", "path alt title")
      .populate("gallery", "path alt title")
      .populate("owner", "firstName lastName fullName")
      .populate("office", "name")
      .select("-status -visibility -id -office -isConfirmed -confirmedAt -confirmedBy -createdBy -createdAt -updatedAt -__v")
      .exec();
  }


}


