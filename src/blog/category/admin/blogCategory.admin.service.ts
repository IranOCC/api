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
    @InjectModel(BlogCategory.name) private blogCategoryModel: Model<BlogCategoryDocument>,
  ) { }


  // Create BlogCategory
  create(data: CreateBlogCategoryDto) {
    return this.blogCategoryModel.create(data);
  }

  // List BlogCategory
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["icons", "icon"],
      ["blogcategories", "parent"]
    ]
    const project = "title slug description tags"
    const virtualFields = {}
    const searchFields = "title slug description"
    return listAggregation(this.blogCategoryModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get BlogCategory
  findOne(id: string) {
    return this.blogCategoryModel.findById(id)
      .populate(["icon"])
      .exec();
  }

  // Edit BlogCategory
  update(id: string, data: UpdateBlogCategoryDto) {
    return this.blogCategoryModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single BlogCategory
  remove(id: string) {
    // TODO: remove other
    return this.blogCategoryModel.deleteOne({ _id: id })
  }

  // Remove Bulk BlogCategory
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.blogCategoryModel.deleteMany({ _id: { $in: id } })
  }
}


