
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { SmsTemplatesEnum } from '../enum/templates';
import { SmsLog, SmsLogDocument } from '../schemas/sms_log.schema';
import Handlebars from "handlebars"
import * as fs from 'fs'
import { join } from 'path';
import { SmsTemplate, SmsTemplateDocument } from '../schemas/sms_template.schema';




@Injectable()
export class SmsTemplateService {

  constructor(
    @InjectModel(SmsTemplate.name) private templateModel: Model<SmsTemplateDocument>
  ) { }



  getTemplateBySlug(slug: string) {
    return this.templateModel.findOne({ slug }).exec()
  }


  getTemplateById(id: string) {
    return this.templateModel.findById(id)
  }



}
