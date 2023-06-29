import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { BlogComment, BlogCommentDocument } from '../schemas/blogComment.schema';
import { CreateBlogCommentDto } from './dto/createBlogComment.dto';
import { UpdateBlogCommentDto } from './dto/updateBlogComment.dto';





@Injectable()
export class BlogCommentAdminService {
  constructor(
    @InjectModel(BlogComment.name) private blogCommentModel: Model<BlogCommentDocument>,
  ) { }


  // Create BlogComment
  create(data: CreateBlogCommentDto) {
    return this.blogCommentModel.create(data);
  }

  // List BlogComment
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      // ["users", "owner"],
      // ["estatecategories", "parent"]
    ]
    const project = "title slug"
    const virtualFields = {}
    const searchFields = "title slug excerpt content"
    return listAggregation(this.blogCommentModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }

  // Get BlogComment
  findOne(id: string) {
    return this.blogCommentModel.findById(id)
      // .populate(["icon", "parent"])
      .exec();
  }

  // Edit BlogComment
  update(id: string, data: UpdateBlogCommentDto) {
    return this.blogCommentModel.updateOne({ _id: id }, data).exec();
  }

  // Remove Single BlogComment
  remove(id: string) {
    // TODO: remove other
    return this.blogCommentModel.deleteOne({ _id: id })
  }

  // Remove Bulk BlogComment
  async bulkRemove(id: string[]) {
    // TODO: remove other
    await this.blogCommentModel.deleteMany({ _id: { $in: id } })
  }
}


