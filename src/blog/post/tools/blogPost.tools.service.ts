import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotAcceptableException, NotFoundException, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { RoleEnum } from 'src/user/enum/role.enum';
import moment from 'moment';






@Injectable()
export class BlogPostToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) { }

  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug excerpt content"
    const displayPath = "title"
    return await listAutoComplete(this.blogPostModel, query, searchFields, displayPath)
  }


  statics(subject: string) {
    const data = { visibility: PostVisibilityEum, status: PostStatusEum }
    return translateStatics(this.i18n, `blogPost.${subject}`, data[subject]) || {}
  }


  // actions: create update findOne find remove
  async checking(user: CurrentUser, action: string, id?: string) {

    // check my offices if not superAdmin
    if (!user.roles.includes(RoleEnum.SuperAdmin)) {
      if (!user?.offices?.length) throw new NotAcceptableException("You are not member of any office", "NoOffice")
    }

    if (action === "create") {
      return {
        allowSubmit: true,
        title: { disabled: false },
        slug: { disabled: false },
        excerpt: { disabled: false },
        content: { disabled: false },
        image: { disabled: false },
        categories: { disabled: false },
        tags: { disabled: false },
        status: {
          disabled: false,
          default: PostStatusEum.Publish,
        },
        visibility: {
          disabled: false,
          default: PostVisibilityEum.Public,
        },
        pinned: {
          disabled: false,
          default: false,
        },
        publishedAt: {
          disabled: false,
          default: new Date().toISOString(),
        },
        author: {
          disabled: false,
          default: user._id,
        },
        office: {
          disabled: false,
          default: user.offices[0]._id,
        }
      }
    }

    if (action === "update") {
      const doc = await this.blogPostModel.findById(id).populate("office")
      if (!doc) throw new NotFoundException("Post not found", "PostNotFound")

      if (
        user.roles.includes(RoleEnum.SuperAdmin)
        ||
        user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id))
        ||
        user.roles.includes(RoleEnum.Author) && doc.createdBy.equals(user._id) && (doc.office.members.includes(user._id))
      ) {
        return {
          allowSubmit: true,
          allowConfirm: user.roles.includes(RoleEnum.SuperAdmin) || user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id)),
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          image: { disabled: false },
          categories: { disabled: false },
          tags: { disabled: false },
          status: { disabled: false },
          visibility: { disabled: false },
          pinned: { disabled: false },
          publishedAt: { disabled: false },
          author: { disabled: false },
          office: { disabled: false },
        }
      }

      return {
        allowSubmit: false,
        allowConfirm: false,
        title: { disabled: true },
        slug: { disabled: true },
        excerpt: { disabled: true },
        content: { disabled: true },
        image: { disabled: true },
        categories: { disabled: true },
        tags: { disabled: true },
        status: { disabled: true },
        visibility: { disabled: true },
        pinned: { disabled: true },
        publishedAt: { disabled: true },
        author: { disabled: true },
        office: { disabled: true },
      }
    }

  }

}
