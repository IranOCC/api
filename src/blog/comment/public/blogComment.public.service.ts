import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { BlogComment, BlogCommentDocument } from '../schemas/blogComment.schema';
import { User } from 'src/user/schemas/user.schema';
import { NewCommentDto } from './dto/newComment.dto';
import { ObjectId } from 'mongodb';




@Injectable()
export class BlogCommentPublicService {
  constructor(
    @InjectModel(BlogComment.name) private blogCommentModel: Model<BlogCommentDocument>,
  ) { }


  // New Comment
  create(post: string, data: NewCommentDto, user?: User) {
    return this.blogCommentModel.create({
      post,
      name: data.name,
      phone: data.phone,
      content: data.content,
      createdBy: user,
      replyTo: data.replyTo,
    })
  }


  // List Comments
  findAll(post: string, pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
    ]
    const project = "name content pinned createdAt"
    const virtualFields = {}
    const searchFields = ""
    if (!filter) filter = {}
    if (!filter.replayTo) filter.replayTo = null
    filter.post = { $eq: new ObjectId(post) }
    return listAggregation(this.blogCommentModel, pagination, filter, sort, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }


}


