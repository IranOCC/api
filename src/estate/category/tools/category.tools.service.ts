import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { EstateCategory, EstateCategoryDocument } from '../schemas/estateCategory.schema';






@Injectable()
export class EstateCategoryToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(EstateCategory.name) private estateCategoryModel: Model<EstateCategoryDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug description"
    const displayPath = "title"
    return await listAutoComplete(this.estateCategoryModel, query, searchFields, displayPath)
  }

}
