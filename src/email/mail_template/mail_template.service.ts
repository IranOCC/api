
import { Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailTemplate, MailTemplateDocument } from '../schemas/mail_template.schema';



@Injectable()
export class MailTemplateService {

  constructor(
    @InjectModel(MailTemplate.name) private templateModel: Model<MailTemplateDocument>
  ) { }



  getTemplateBySlug(slug: string) {
    return this.templateModel.findOne({ slug }).exec()
  }


  getTemplateById(id: string) {
    return this.templateModel.findById(id)
  }



}
