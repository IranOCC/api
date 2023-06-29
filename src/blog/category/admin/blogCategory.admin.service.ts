import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { BlogCategory, BlogCategoryDocument } from '../schemas/blogCategory.schema';
import { CreateBlogCategoryDto } from './dto/createBlogCategoryPost.dto';
import { UpdateBlogCategoryDto } from './dto/updateBlogCategoryPost.dto';





@Injectable()
export class BlogCategoryAdminService {
  constructor(
    @InjectModel(BlogCategory.name) private BlogCategoryModel: Model<BlogCategoryDocument>,
  ) { }


  // Create BlogCategory
  create(data: CreateBlogCategoryDto) {
    return this.BlogCategoryModel.create(data);
  }

  // List BlogCategory
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      // ["users", "owner"],
      // ["estatecategories", "parent"]
    ]
    const project = "title slug"
    const virtualFields = {}
    const searchFields = "title slug excerpt content"
    return listAggregation(this.BlogCategoryModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get BlogCategory
  findOne(id: string) {
    return this.BlogCategoryModel.findById(id)
      // .populate(["icon", "parent"])
      .exec();
  }

  // Edit BlogCategory
  update(id: string, data: UpdateBlogCategoryDto) {
    return this.BlogCategoryModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single BlogCategory
  remove(id: string) {
    // TODO: remove other
    return this.BlogCategoryModel.deleteOne({ _id: id })
  }

  // Remove Bulk BlogCategory
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.BlogCategoryModel.deleteMany({ _id: { $in: id } })
  }
}


