
import { ConflictException, Injectable, NotAcceptableException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { CreateSmsTemplateDto } from '../dto/createSmsTemplate.dto';
import { UpdateSmsTemplateDto } from '../dto/updateSmsTemplate.dto';





@Injectable()
export class SmsTemplateServiceAdmin {

  constructor(
    private i18n: I18nService,
    @InjectModel(SmsTemplate.name) private templateModel: Model<SmsTemplateDocument>
  ) { }

  create(data: CreateSmsTemplateDto) {
    return this.templateModel.create(data)
  }

  findAll() {
    return this.templateModel.find();
  }

  findOne(id: string) {
    return this.templateModel.findById(id);
  }

  update(id: string, data: UpdateSmsTemplateDto) {
    return this.templateModel.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  remove(id: string) {
    return this.templateModel.deleteOne({ _id: id });
  }

  bulkRemove(id: string[]) {
    return this.templateModel.deleteMany({ _id: { $in: id } });
  }


}
