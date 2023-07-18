import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { Page, PageDocument } from '../schemas/page.schema';
import { CreatePageDto } from './dto/createPage.dto';
import { UpdatePageDto } from './dto/updatePage.dto';
import { CurrentUser } from 'src/user/schemas/user.schema';





@Injectable()
export class PageAdminService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
  ) { }


  // Create Page
  create(data: CreatePageDto, user: CurrentUser) {
    return this.pageModel.create({ ...data, createdBy: user._id });
  }

  // Edit Page
  update(id: string, data: UpdatePageDto, user: CurrentUser) {
    return this.pageModel.updateOne({ _id: id }, data).exec();
  }

  // List Page
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "createdBy"],
    ]
    const project = "title slug status publishedAt createdAt updatedAt"
    const virtualFields = {}
    const searchFields = "title slug content"
    return listAggregation(this.pageModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get Page
  findOne(id: string) {
    return this.pageModel.findById(id)
      .populate("createdBy", "fistName lastName fullName")
      .exec();
  }



  // Remove Single Page
  remove(id: string) {
    // TODO: remove other
    return this.pageModel.deleteOne({ _id: id })
  }

  // Remove Bulk Page
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.pageModel.deleteMany({ _id: { $in: id } })
  }
}


