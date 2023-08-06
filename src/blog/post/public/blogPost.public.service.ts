import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { ObjectId } from 'mongodb';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { PaginationDto } from 'src/utils/dto/pagination.dto';




@Injectable()
export class BlogPostPublicService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) { }


  // Get BlogPost
  findOneBySlugOrID(id_or_slug: string) {
    let query = ObjectId.isValid(id_or_slug) ? { _id: new ObjectId(id_or_slug) } : { slug: id_or_slug }
    query["status"] = PostStatusEum.Publish
    query["visibility"] = PostVisibilityEum.Public
    query["isConfirmed"] = true
    query["publishedAt"] = { $lte: Date.now() }

    return this.blogPostModel.findOne(query)
      .populate("categories", "title slug")
      .populate("image", "path alt title")
      .populate("author", "firstName lastName fullName")
      .select("-status -visibility -id -office -isConfirmed -confirmedAt -confirmedBy -createdBy -createdAt -updatedAt -__v")
      .exec();
  }


  // List Estate
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
    filter["status"] = PostStatusEum.Publish
    filter["visibility"] = PostVisibilityEum.Public
    filter["isConfirmed"] = true
    filter["publishedAt"] = { $lte: new Date() }


    return listAggregation(this.blogPostModel, pagination, filter, sort, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }


}


