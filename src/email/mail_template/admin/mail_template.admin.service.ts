
import { Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { MailTemplate, MailTemplateDocument } from 'src/email/schemas/mail_template.schema';
import { CreateMailTemplateDto } from '../dto/createMailTemplate.dto';
import { UpdateMailTemplateDto } from '../dto/updateMailTemplate.dto';




@Injectable()
export class MailTemplateServiceAdmin {

  constructor(
    private i18n: I18nService,
    @InjectModel(MailTemplate.name) private templateModel: Model<MailTemplateDocument>
  ) { }

  create(data: CreateMailTemplateDto) {
    return this.templateModel.create(data)
  }

  findAll() {
    return this.templateModel.find();
  }

  findOne(id: string) {
    return this.templateModel.findById(id);
  }

  update(id: string, data: UpdateMailTemplateDto) {
    return this.templateModel.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  remove(id: string) {
    return this.templateModel.deleteOne({ _id: id });
  }

  bulkRemove(id: string[]) {
    return this.templateModel.deleteMany({ _id: { $in: id } });
  }


}
