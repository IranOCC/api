import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Estate, EstateDocument } from '../schemas/estate.schema';
import { EstateStatusEnum } from '../enum/estateStatus.enum';
import { EstateVisibilityEnum } from '../enum/estateVisibility.enum';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';




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


  // List Estate
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "owner", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["offices", "office", "name", false],
      // 
      ["estatecategories", "category", "title slug icon", false, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      ["estatetypes", "type", "title slug icon", false, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      ["estatefeatures", "features", "title slug icon", false, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      ["estatedocumenttypes", "documentType", "title slug icon", false, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      // 
      ["storages", "image", "path alt title", false],
      ["storages", "gallery", "path alt title", true],
    ]
    const project = "title slug excerpt area canBarter buildingArea roomCount mastersCount buildingArea floorsCount unitsCount floor withOldBuilding publishedAt createdAt code province city district"
    const virtualFields = {}
    const searchFields = "title slug excerpt content code province city district quarter alley address"
    filter["status"] = EstateStatusEnum.Publish
    filter["visibility"] = EstateVisibilityEnum.Public
    filter["isConfirmed"] = true
    filter["publishedAt"] = { $lte: Date.now() }
    return listAggregation(this.estateModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }


}


