import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { Estate, EstateDocument } from '../schemas/estate.schema';
import { CreateEstateDto } from './dto/createEstate.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { RoleEnum } from 'src/user/enum/role.enum';
import { OfficeService } from 'src/office/office.service';
import { ObjectId } from 'mongodb';



@Injectable()
export class EstateAdminService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
    private officeService: OfficeService,
  ) { }


  // Create Estate
  async create(data: CreateEstateDto, user: CurrentUser | User) {
    // get office
    const _office = await this.officeService.checkOffice(data.office)

    // is SuperAdmin
    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      return this.estateModel.create({ ...data, createdBy: user._id });
    }
    // is Admin & management of office
    if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
      return this.estateModel.create({ ...data, createdBy: user._id });
    }
    // is Agent & member of office
    if (user.roles.includes(RoleEnum.Agent) && (_office.members.includes(user._id))) {
      return this.estateModel.create({ ...data, createdBy: user._id });
    }

    // throw
    throw new ForbiddenException("You don't have access to create estate for this office", "NoAccessCreateEstate")
  }

  // Edit Estate
  async update(id: string, data: UpdateEstateDto, user: CurrentUser | User) {
    const post = await this.estateModel.findById(id).populate("office", "_id management members")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")

    // get office
    const _office = await this.officeService.checkOffice(data?.office || post?.office)

    // is SuperAdmin
    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      return this.estateModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null, isRejected: false, rejectedAt: null, rejectedBy: null, rejectedReason: null });
    }
    // is Admin & management of office
    if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
      return this.estateModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null, isRejected: false, rejectedAt: null, rejectedBy: null, rejectedReason: null });
    }
    // is Agent & member of office
    if (user.roles.includes(RoleEnum.Agent) && post.createdBy.equals(user._id) && (_office.members.includes(user._id))) {
      return this.estateModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null, isRejected: false, rejectedAt: null, rejectedBy: null, rejectedReason: null });
    }

    // throw
    throw new ForbiddenException("You don't have access to edit this post", "EditAccessDenied")
  }

  // confirm publish estate
  async confirmPublish(id: string, user: CurrentUser | User) {
    const estate = await (await this.estateModel.findById(id)).populate("office", "_id management members")
    if (!estate) throw new NotFoundException("Estate not found", "EstateNotFound")
    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && (estate.office.management as User)._id.equals(user._id))
    ) {
      estate.isConfirmed = true
      estate.confirmedAt = new Date()
      estate.confirmedBy = user._id
      // 
      estate.isRejected = false
      estate.rejectedAt = null
      estate.rejectedBy = null
      estate.rejectedReason = null
      // 
      return await estate.save()
    }

    throw new ForbiddenException("You don't have access to confirm or reject this estate", "ConfirmRejectAccessDenied")
  }


  // reject publish estate
  async rejectPublish(id: string, reason: string, user: CurrentUser | User) {
    const estate = await (await this.estateModel.findById(id)).populate("office", "_id management members")
    if (!estate) throw new NotFoundException("Estate not found", "EstateNotFound")
    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && (estate.office.management as User)._id.equals(user._id))
    ) {
      estate.isConfirmed = false
      estate.confirmedAt = null
      estate.confirmedBy = null
      // 
      estate.isRejected = true
      estate.rejectedAt = new Date()
      estate.rejectedBy = user._id
      estate.rejectedReason = reason
      // 
      return await estate.save()
    }

    throw new ForbiddenException("You don't have access to confirm or reject this estate", "ConfirmRejectAccessDenied")
  }



  // List Estate
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "owner", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "confirmedBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "rejectedBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["offices", "office", "name", false],
      ["estatecategories", "category", "title"],
    ]
    const project = "title slug status visibility isConfirmed confirmedAt isRejected rejectedAt rejectedReason publishedAt createdAt code"
    const virtualFields = {}
    const searchFields = "title slug excerpt content code province city district quarter alley address description"


    if (filter.category) {
      if (typeof filter.category === "string") filter.category = [filter.category]
      filter["category._id"] = { $in: filter.category.map((v: string) => new ObjectId(v)) }
      delete filter.category
    }
    if (filter.createdBy) {
      console.log(filter.createdBy);
      if (typeof filter.createdBy === "string") filter.createdBy = [filter.createdBy]
      filter["createdBy._id"] = { $in: filter.createdBy.map((v: string) => new ObjectId(v)) }
      delete filter.createdBy
    }
    if (filter.office) {
      if (typeof filter.office === "string") filter.office = [filter.office]
      filter["office._id"] = { $in: filter.office.map((v: string) => new ObjectId(v)) }
      delete filter.office
    }
    if (filter.crp) {
      if (typeof filter.crp === "string") filter.crp = [filter.crp]
      if (filter.crp.includes("confirmed") && filter.crp.includes("rejected") && filter.crp.includes("pending")) {

      }
      else if (filter.crp.includes("confirmed") && filter.crp.includes("rejected")) {
        filter["$or"] = [{ ["isConfirmed"]: { $eq: true } }, { ["isRejected"]: { $eq: true } }]
      }
      else if (filter.crp.includes("confirmed") && filter.crp.includes("pending")) {
        filter["isRejected"] = { $in: [false, null, undefined] }
      }
      else if (filter.crp.includes("rejected") && filter.crp.includes("pending")) {
        filter["isConfirmed"] = { $in: [false, null, undefined] }
      }
      else if (filter.crp.includes("confirmed")) {
        filter["isConfirmed"] = { $eq: true }
      }
      else if (filter.crp.includes("rejected")) {
        filter["isRejected"] = { $eq: true }
      }
      else if (filter.crp.includes("pending")) {
        filter["isConfirmed"] = { $eq: false }
        filter["isRejected"] = { $eq: false }
      }
      delete filter.crp
    }

    return listAggregation(this.estateModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get Estate
  findOne(id: string) {
    return this.estateModel.findById(id)
      .populate("gallery", 'path title alt')
      .populate("image", 'path title alt')
      .populate("confirmedBy", "fistName lastName fullName")
      .populate("rejectedBy", "fistName lastName fullName")
      .populate("createdBy", "fistName lastName fullName")
      .exec();
  }



  // Remove Single Estate
  async remove(id: string, user: CurrentUser | User) {
    const estate = await this.estateModel.findById(id).populate("office", "_id management members")
    if (!estate) throw new NotFoundException("Estate not found", "EstateNotFound")

    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && ((estate.office.management as User)._id.equals(user._id)))
      ||
      (user.roles.includes(RoleEnum.Agent) && !estate.isConfirmed && estate.createdBy.equals(user._id) && (estate.office.members.includes(user._id)))
    ) {
      // TODO: remove other
      return await estate.delete()
    }
    throw new ForbiddenException("You can not delete this estate", "ForbiddenDeleteEstate")
  }

  // Remove Bulk Estate
  async bulkRemove(id: string[], user: CurrentUser | User) {
    const estates = await this.estateModel.find({ _id: { $in: id } }).populate("office")

    for (let i = 0; i < estates.length; i++) {
      const estate = estates[i];
      if (
        (user.roles.includes(RoleEnum.SuperAdmin))
        ||
        (user.roles.includes(RoleEnum.Admin) && ((estate.office.management as User)._id.equals(user._id)))
        ||
        (user.roles.includes(RoleEnum.Agent) && !estate.isConfirmed && estate.createdBy.equals(user._id) && (estate.office.members.includes(user._id)))
      ) {
        // TODO: remove other
        await estate.delete()
      }
    }
    return null
  }
}


