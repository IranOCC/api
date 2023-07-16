import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { CreateBlogPostDto } from './dto/createBlogPost.dto';
import { UpdateBlogPostDto } from './dto/updateBlogPost.dto';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { RoleEnum } from 'src/user/enum/role.enum';
import { OfficeService } from 'src/office/office.service';




@Injectable()
export class BlogPostAdminService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
    private officeService: OfficeService,
  ) { }


  // Create BlogPost
  async create(data: CreateBlogPostDto, user: CurrentUser) {

    // get office
    const _office = await this.officeService.checkOffice(data.office)

    // is SuperAdmin
    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      return this.blogPostModel.create({ ...data, createdBy: user._id });
    }
    // is Admin & management of office
    if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
      return this.blogPostModel.create({ ...data, createdBy: user._id });
    }
    // is Author & member of office
    if (user.roles.includes(RoleEnum.Author) && (_office.members.includes(user._id))) {
      return this.blogPostModel.create({ ...data, createdBy: user._id });
    }

    // throw
    throw new ForbiddenException("You don't have access to create post for this office", "NoAccessCreatePost")
  }



  // Edit BlogPost
  async update(id: string, data: UpdateBlogPostDto, user: CurrentUser) {
    const post = await this.blogPostModel.findById(id).populate("office", "_id management members")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")

    // get office
    const _office = await this.officeService.checkOffice(data?.office || post?.office)

    // is SuperAdmin
    if (user.roles.includes(RoleEnum.SuperAdmin)) {
      return this.blogPostModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null });
    }
    // is Admin & management of office
    if (user.roles.includes(RoleEnum.Admin) && ((_office.management as User)._id.equals(user._id))) {
      return this.blogPostModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null });
    }
    // is Author & member of office
    if (user.roles.includes(RoleEnum.Author) && post.createdBy.equals(user._id) && (_office.members.includes(user._id))) {
      return this.blogPostModel.updateOne({ _id: id }, { ...data, isConfirmed: false, confirmedAt: null, confirmedBy: null });
    }

    // throw
    throw new ForbiddenException("You don't have access to edit this post", "EditAccessDenied")
  }



  // confirm publish post
  async confirmPublish(id: string, user: CurrentUser) {
    const post = await (await this.blogPostModel.findById(id)).populate("office", "_id management members")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")
    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && (post.office.management as User)._id.equals(user._id))
    ) {
      post.isConfirmed = true
      post.confirmedAt = new Date()
      post.confirmedBy = user._id
      return await post.save()
    }

    throw new ForbiddenException("You don't have access to confirm or reject this post", "ConfirmRejectAccessDenied")
  }


  // reject publish post
  async rejectPublish(id: string, user: CurrentUser) {
    const post = await (await this.blogPostModel.findById(id)).populate("office", "_id management members")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")
    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && (post.office.management as User)._id.equals(user._id))
    ) {
      post.isConfirmed = false
      post.confirmedAt = null
      post.confirmedBy = null
      return await post.save()
    }

    throw new ForbiddenException("You don't have access to confirm or reject this post", "ConfirmRejectAccessDenied")
  }


  // List BlogPost
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "author", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "createdBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["users", "confirmedBy", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["offices", "office", "name", false],
    ]
    const project = "title slug status visibility isConfirmed confirmedAt publishedAt createdAt"
    const virtualFields = {}
    const searchFields = "title slug excerpt content"
    return listAggregation(this.blogPostModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }


  // Get BlogPost
  findOne(id: string) {
    return this.blogPostModel.findById(id)
      .populate("image", 'path title alt')
      .populate("confirmedBy", "fistName lastName fullName")
      .populate("createdBy", "fistName lastName fullName")
      .exec();
  }

  // Remove Single BlogPost
  async remove(id: string, user: CurrentUser) {
    const post = await this.blogPostModel.findById(id).populate("office", "_id management members")
    if (!post) throw new NotFoundException("Post not found", "PostNotFound")

    if (
      (user.roles.includes(RoleEnum.SuperAdmin))
      ||
      (user.roles.includes(RoleEnum.Admin) && ((post.office.management as User)._id.equals(user._id)))
      ||
      (user.roles.includes(RoleEnum.Author) && !post.isConfirmed && post.createdBy.equals(user._id) && (post.office.members.includes(user._id)))
    ) {
      // TODO: remove other
      return await post.delete()
    }
    throw new ForbiddenException("You can not delete this post", "ForbiddenDeletePost")
  }

  // Remove Bulk BlogPost
  async bulkRemove(id: string[], user: CurrentUser) {
    const posts = await this.blogPostModel.find({ _id: { $in: id } }).populate("office")

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (
        (user.roles.includes(RoleEnum.SuperAdmin))
        ||
        (user.roles.includes(RoleEnum.Admin) && ((post.office.management as User)._id.equals(user._id)))
        ||
        (user.roles.includes(RoleEnum.Author) && !post.isConfirmed && post.createdBy.equals(user._id) && (post.office.members.includes(user._id)))
      ) {
        // TODO: remove other
        await post.delete()
      }
    }
    return null
  }



}


