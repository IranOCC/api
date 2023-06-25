
import { ConflictException, Injectable, NotAcceptableException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { CreateSmsTemplateDto } from '../dto/createSmsTemplate.dto';
import { UpdateSmsTemplateDto } from '../dto/updateSmsTemplate.dto';





@Injectable()
export class SmsTemplateService {

  constructor(
    private i18n: I18nService,
    @InjectModel(SmsTemplate.name) private templateModel: Model<SmsTemplateDocument>
  ) { }

  create(data: CreateSmsTemplateDto) {
    this.templateModel.create(data)
  }

  findAll() {
    return this.templateModel.find();
  }

  findOne(id: string) {
    return this.templateModel.findById(id);
  }

  update(id: string, data: UpdateSmsTemplateDto) {
    this.templateModel.findOneAndUpdate({ _id: id }, data);
  }

  remove(id: string) {
    this.templateModel.deleteOne({ _id: id });
  }


}
