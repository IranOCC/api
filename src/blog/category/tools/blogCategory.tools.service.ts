import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { BlogCategory, BlogCategoryDocument } from '../schemas/blogCategory.schema';







@Injectable()
export class BlogCategoryToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(BlogCategory.name) private BlogCategoryModel: Model<BlogCategoryDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug excerpt content"
    const displayPath = "title"
    return await listAutoComplete(this.BlogCategoryModel, query, searchFields, displayPath)
  }



}
