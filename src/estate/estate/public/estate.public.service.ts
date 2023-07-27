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
      .populate({ path: "category", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate({ path: "type", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate({ path: "documentType", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate({ path: "features", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate("image", "path alt title")
      .populate("gallery", "path alt title")
      .populate("owner", "firstName lastName fullName")
      .populate("createdBy", "firstName lastName fullName")
      .populate("office", "name verified")
      .select("-status -visibility -id -isConfirmed -confirmedAt -confirmedBy -createdAt -updatedAt -__v")
      .exec();
  }


}


