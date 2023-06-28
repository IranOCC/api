
import { ConflictException, Injectable, NotAcceptableException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { filter } from 'rxjs';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { CreateSmsTemplateDto } from '../dto/createSmsTemplate.dto';
import { UpdateSmsTemplateDto } from '../dto/updateSmsTemplate.dto';





@Injectable()
export class SmsTemplateServiceAdmin {

  constructor(
    private i18n: I18nService,
    @InjectModel(SmsTemplate.name) private templateModel: Model<SmsTemplateDocument>
  ) { }


  // Create MailTemplate
  create(data: CreateSmsTemplateDto) {
    return this.templateModel.create(data)
  }

  // List MailTemplate
  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = []
    const project = "title slug content serviceID"
    const virtualFields = {}
    const searchFields = "title slug"
    return listAggregation(this.templateModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }


  // Get MailTemplate
  findOne(id: string) {
    return this.templateModel.findById(id);
  }


  // Edit MailTemplate
  update(id: string, data: UpdateSmsTemplateDto) {
    return this.templateModel.findOneAndUpdate({ _id: id }, data, { new: true });
  }


  // Remove Single MailTemplate
  remove(id: string) {
    return this.templateModel.deleteOne({ _id: id });
  }


  // Remove Bulk MailTemplate
  bulkRemove(id: string[]) {
    return this.templateModel.deleteMany({ _id: { $in: id } });
  }


}
