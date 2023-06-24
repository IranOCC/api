
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
import { SmsTemplate } from '../schemas/sms_template.schema';



const TemplatesID = {
  "otp": 621415
}


@Injectable()
export class SmsLogService {

  constructor(
    @InjectModel(SmsLog.name) private logModel: Model<SmsLogDocument>
  ) { }



  create(phone: PhoneNumber, context: any = {}, template: SmsTemplate, sentBy: User, relatedTo?: RelatedToEnum, relatedToID?: string) {
    return this.logModel.create({
      phone: phone._id,
      user: phone?.user || null,
      office: phone?.office || null,

      template: template._id,
      context,

      relatedTo: relatedTo || undefined,
      relatedToID: relatedToID || undefined,
      sentBy: sentBy?._id || undefined
    })
  }


  find(phone: PhoneNumber, relatedTo?: RelatedToEnum, relatedToID?: string) {
    if (relatedTo && relatedToID) {
      return this.logModel
        .find({ phone: phone._id })
        .find({ relatedTo, relatedToID })
        .populate("sentBy", "fullName")
        .populate("phone", "value")
        .populate("template", "content")
    }
    if (relatedTo) {
      return this.logModel
        .find({ phone: phone._id })
        .find({ relatedTo })
        .populate("sentBy", "fullName")
        .populate("phone", "value")
        .populate("template", "content")
    }
    return this.logModel
      .find({ phone: phone._id })
      .populate("sentBy", "fullName")
      .populate("phone", "value")
      .populate("template", "content")
  }



}
