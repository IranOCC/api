import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { BlogPost, BlogPostDocument } from '../schemas/blogPost.schema';
import { PostStatusEum } from '../enum/postStatus.enum';
import { PostVisibilityEum } from '../enum/postVisibility.enum';






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

}
