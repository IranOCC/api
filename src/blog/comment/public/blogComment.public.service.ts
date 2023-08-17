import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { BlogComment, BlogCommentDocument } from '../schemas/blogComment.schema';
import { User } from 'src/user/schemas/user.schema';
import { NewCommentDto } from './dto/newComment.dto';




@Injectable()
export class BlogCommentPublicService {
  constructor(
    @InjectModel(BlogComment.name) private blogCommentModel: Model<BlogCommentDocument>,
  ) { }


  // NewComment
  create(post: string, data: NewCommentDto, user: User) {

  }


  // List BlogPost
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "author", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      // 
      ["blogcategories", "categories", "title slug icon", true, [{ $lookup: { from: "icons", localField: "_id", foreignField: "icon", as: "icon" } }]],
      ["storages", "image", "path alt title", false],
    ]
    const project = "title slug excerpt publishedAt createdAt"
    const virtualFields = {}
    const searchFields = "title slug excerpt content"
    if (!filter) filter = {}



    return listAggregation(this.blogCommentModel, pagination, filter, sort, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }


}


