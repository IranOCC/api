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



@Injectable()
export class EstateAdminService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
    private officeService: OfficeService,
  ) { }


  // Create Estate
  async create(data: CreateEstateDto, user: CurrentUser) {
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
  async update(id: string, data: UpdateEstateDto, user: CurrentUser) {
    const post = await this.estateModel.findById(id).populate("office", "_id management members")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")

    // get office
    const _office = await this.officeService.checkOffice(data?.office || post?.office)

    // is SuperAdmin
    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      return this.estateModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null });
    }
    // is Admin & management of office
    if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
      return this.estateModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null });
    }
    // is Agent & member of office
    if (user.roles.includes(RoleEnum.Agent) && post.createdBy.equals(user._id) && (_office.members.includes(user._id))) {
      return this.estateModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null });
    }

    // throw
    throw new ForbiddenException("You don't have access to edit this post", "EditAccessDenied")
  }

  // confirm publish estate
  async confirmPublish(id: string, user: CurrentUser) {
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
      return await estate.save()
    }

    throw new ForbiddenException("You don't have access to confirm or reject this estate", "ConfirmRejectAccessDenied")
  }


  // reject publish estate
  async rejectPublish(id: string, user: CurrentUser) {
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
      ["offices", "office", "name", false],
    ]
    const project = "title slug status visibility isConfirmed confirmedAt publishedAt createdAt code"
    const virtualFields = {}
    const searchFields = "title slug excerpt content code province city district quarter alley address description"
    return listAggregation(this.estateModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get Estate
  findOne(id: string) {
    return this.estateModel.findById(id)
      .populate("image", 'path title alt')
      .populate("confirmedBy", "fistName lastName fullName")
      .populate("createdBy", "fistName lastName fullName")
      .exec();
  }



  // Remove Single Estate
  async remove(id: string, user: CurrentUser) {
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
  async bulkRemove(id: string[], user: CurrentUser) {
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


