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
      ["users", "createdBy", "firstName lastName fullName avatar", false, [
        { $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } },
        {
          $lookup: {
            from: "storages",
            as: "avatar",
            localField: "avatar",
            foreignField: "_id",
            pipeline: [
              { $project: { path: "$path", alt: "$alt", title: "$title" } }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            avatar: { $first: `$avatar` },
            fullName: `$fullName`,
          }
        }
      ]],
      ["blogcomments", ["_id", "replyTo", "responses"], "_id", true],
    ]
    const project = "name content pinned createdAt"
    const virtualFields = {}
    const searchFields = ""
    if (!filter) filter = {}
    if (!filter.replyTo) filter.replyTo = null
    else filter.replyTo = { $eq: new ObjectId(filter.replyTo) }
    filter.post = { $eq: new ObjectId(post) }
    return listAggregation(this.blogCommentModel, pagination, filter, sort, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }


}


