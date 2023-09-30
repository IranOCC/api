import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Estate, EstateDocument } from '../schemas/estate.schema';
import { EstateStatusEnum } from '../enum/estateStatus.enum';
import { EstateVisibilityEnum } from '../enum/estateVisibility.enum';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { User } from 'src/user/schemas/user.schema';
import { EstateFavorite, EstateFavoriteDocument } from 'src/estate/favorite/schemas/estateFavorite.schema';
import { CreatePropertyDto } from './dto/createProperty.dto';
import slugify from 'slugify';



@Injectable()
export class EstatePublicService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
    @InjectModel(EstateFavorite.name) private estateFavoriteModel: Model<EstateFavoriteDocument>,
  ) { }

  // Create Property
  async create(data: CreatePropertyDto, user: User) {
    return this.estateModel.create({
      // 
      ...data,
      slug: slugify(data.title, {
        replacement: "_",
        remove: undefined,
        lower: false,
        strict: false,
        locale: "fa",
        trim: true,
      }),
      status: EstateStatusEnum.Draft,
      visibility: EstateVisibilityEnum.Public,

      owner: user._id,
      createdBy: user._id,
      office: "64f8cbf151ca333bab196cf1",


    });
  }


  // Get BlogPost
  async findOneBySlugOrID(id_or_slug: string, user: User) {
    let query = ObjectId.isValid(id_or_slug) ? { _id: new ObjectId(id_or_slug) } : { slug: id_or_slug }
    query["status"] = EstateStatusEnum.Publish
    query["visibility"] = EstateVisibilityEnum.Public
    query["isConfirmed"] = true
    query["publishedAt"] = { $lte: Date.now() }


    const estate = await this.estateModel.findOne(query)
      .populate({ path: "category", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate({ path: "type", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate({ path: "documentType", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate({ path: "features", select: "title slug icon", populate: { path: "icon", select: "content" } })
      .populate("image", "path alt title")
      .populate("gallery", "path alt title")
      // .populate("owner", "firstName lastName fullName")
      // .populate("createdBy", "firstName lastName fullName")
      .populate({ path: "createdBy", select: "firstName lastName fullName", populate: [{ path: "avatar", select: "alt title path" }, { path: "phone", select: "value" }] })
      // .populate("office", "name verified")
      .populate({ path: "office", select: "name verified", populate: { path: "logo", select: "alt title path" } })

      .select("-status -visibility -id -isConfirmed -confirmedAt -confirmedBy -createdAt -updatedAt -__v")
      .lean();

    const isFavorite = user?._id ? await this.estateFavoriteModel.findOne({ user: new ObjectId(user?._id), estate: new ObjectId(estate._id) }) : false

    return { ...estate, isFavorite }
  }


  // List Estate
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      // [
      //   "users", "createdBy", "firstName lastName fullName avatar phone", false,
      //   [
      //     { $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } },
      //     { $lookup: { from: "storages", localField: "avatar", foreignField: "_id", as: "avatar" } },
      //     { $lookup: { from: "phonenumbers", localField: "phone", foreignField: "_id", as: "phone" } },
      //     { $project: { "avatar": { $first: `$avatar` }, "phone": { $first: `$phone` }, "fullName": `$fullName`, "firstName": `$firstName`, "lastName": `$lastName`, } }
      //   ]
      // ],
      // ["offices", "office", "name verified", false],
      // 
      ["estatecategories", "category", "title slug icon", false, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      ["storages", "image", "path alt title", false],
    ]
    const project = "title slug excerpt area canBarter canSwap annualRent dailyRent special buildingArea roomsCount mastersCount constructionYear buildingArea floorsCount unitsCount floor withOldBuilding publishedAt createdAt code province city district"
    const virtualFields = {}
    const searchFields = "title slug excerpt content code province city district quarter alley address"
    if (!filter) filter = {}
    filter["status"] = EstateStatusEnum.Publish
    filter["visibility"] = EstateVisibilityEnum.Public
    filter["isConfirmed"] = true
    filter["publishedAt"] = { $lte: new Date() }

    // convert
    if (filter.category) {
      filter["category._id"] = { $eq: new ObjectId(filter.category) }
      delete filter.category
    }
    if (filter.type) {
      if (typeof filter.type === "string") filter.type = [filter.type]
      filter["type"] = { $in: filter.type.map((v: string) => new ObjectId(v)) }
      // delete filter.type
    }
    if (filter.documentType) {
      if (typeof filter.documentType === "string") filter.documentType = [filter.documentType]
      filter["documentType"] = { $in: filter.documentType.map((v: string) => new ObjectId(v)) }
      // delete filter.documentType
    }
    if (filter.features) {
      if (typeof filter.features === "string") filter.features = [filter.features]
      filter["features"] = { $in: filter.features.map((v: string) => new ObjectId(v)) }
      // delete filter.features
    }

    // =>ok province
    // =>ok city
    if (filter.district) {
      if (typeof filter.district === "string") filter.district = [filter.district]
      filter["district"] = { $in: filter.district.map((v: string) => (v)) }
    }

    if (filter.area) {
      if (typeof filter.area === "string") filter.area = filter.area.split("_")
      filter["area"] = !!filter.area[1] ? { $gte: parseFloat(filter.area[0]), $lte: parseFloat(filter.area[1]) } : { $gte: parseFloat(filter.area[0]) }
    }
    if (filter.price) {
      if (typeof filter.price === "string") filter.price = filter.price.split("_")
      filter["price"] = !!filter.price[1] ? { $gte: parseFloat(filter.price[0]), $lte: parseFloat(filter.price[1]) } : { $gte: parseFloat(filter.price[0]) }
    }
    if (filter.totalPrice) {
      if (typeof filter.totalPrice === "string") filter.totalPrice = filter.totalPrice.split("_")
      filter["totalPrice"] = !!filter.totalPrice[1] ? { $gte: parseFloat(filter.totalPrice[0]), $lte: parseFloat(filter.totalPrice[1]) } : { $gte: parseFloat(filter.totalPrice[0]) }
    }

    if (filter.barter === true) {
      filter["canBarter"] = { $eq: true }
      delete filter.barter
    } else if (filter.barter === false) {
      filter["canBarter"] = { $ne: true }
      delete filter.barter
    }

    console.log(filter.swap)
    if (filter.swap === true) {
      filter["canSwap"] = { $eq: true }
      delete filter.swap
    } else if (filter.swap === false) {
      filter["canSwap"] = { $ne: true }
      delete filter.swap
    }


    if (filter.special === true) {
      filter["special"] = { $eq: true }
    } else if (filter.special === false) {
      filter["special"] = { $ne: true }
    }

    if (filter.dailyRent === true) {
      filter["dailyRent"] = { $eq: true }
    } else if (filter.dailyRent === false) {
      filter["dailyRent"] = { $ne: true }
    }

    if (filter.annualRent === true) {
      filter["annualRent"] = { $eq: true }
    } else if (filter.annualRent === false) {
      filter["annualRent"] = { $ne: true }
    }

    console.log(filter.swap, filter.canSwap);


    // ===
    return listAggregation(this.estateModel, pagination, filter, sort, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }

  // myEstates
  myEstates(pagination: PaginationDto, filter: any, sort: any, user: User) {
    const populate: PopulatedType[] = [
      // ["users", "owner", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      // ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      // 
      ["estatecategories", "category", "title slug icon", false, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      ["storages", "image", "path alt title", false],
    ]
    const project = "title excerpt area isConfirmed confirmedAt isRejected rejectedAt rejectedReason canBarter buildingArea roomsCount mastersCount constructionYear buildingArea floorsCount unitsCount floor withOldBuilding publishedAt createdAt code province city district"
    const virtualFields = {
      // all: { $count: "" }
    }
    const searchFields = "title excerpt content code province city district quarter alley address"
    if (!filter) filter = {}
    filter["createdBy"] = new ObjectId(user._id)
    // filter["visibility"] = EstateVisibilityEnum.Public
    // filter["isConfirmed"] = true
    // filter["publishedAt"] = { $lte: new Date() }

    // convert
    // if (filter.category) {
    //   filter["category._id"] = { $eq: new ObjectId(filter.category) }
    //   delete filter.category
    // }
    return listAggregation(this.estateModel, pagination, filter, sort, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }
}


