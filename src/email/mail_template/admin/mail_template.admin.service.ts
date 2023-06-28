
import { Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { MailTemplate, MailTemplateDocument } from 'src/email/schemas/mail_template.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { CreateMailTemplateDto } from '../dto/createMailTemplate.dto';
import { UpdateMailTemplateDto } from '../dto/updateMailTemplate.dto';




@Injectable()
export class MailTemplateServiceAdmin {

  constructor(
    private i18n: I18nService,
    @InjectModel(MailTemplate.name) private templateModel: Model<MailTemplateDocument>
  ) { }

  // Create MailTemplate
  create(data: CreateMailTemplateDto) {
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
  update(id: string, data: UpdateMailTemplateDto) {
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
