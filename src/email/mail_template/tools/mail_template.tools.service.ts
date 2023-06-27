import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { MailTemplate, MailTemplateDocument } from 'src/email/schemas/mail_template.schema';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';






@Injectable()
export class MailTemplateServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(MailTemplate.name) private templateModel: Model<MailTemplateDocument>
  ) { }


  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug"
    const displayPath = "title"
    return await listAutoComplete(this.templateModel, query, searchFields, displayPath)
  }

}
