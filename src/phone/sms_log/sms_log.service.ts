
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Smsir } from 'sms-typescript/lib';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { SmsLog, SmsLogDocument } from '../schemas/sms_log.schema';
import Handlebars from "handlebars"
import * as fs from 'fs'
import { join } from 'path';
import { SmsTemplate } from '../schemas/sms_template.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';



@Injectable()
export class SmsLogService {

  constructor(
    @InjectModel(SmsLog.name) private logModel: Model<SmsLogDocument>
  ) { }



  create(phone: PhoneNumber, context: any = {}, template: SmsTemplate, sentBy?: User, relatedTo?: RelatedToEnum, relatedToID?: string) {
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


  findAll(pagination: PaginationDto, filter: any, sort: any) {
    const populate: PopulatedType[] = [
      ["users", "sentBy", "firstName lastName"],
      ["phonenumbers", "phone", "value"],
      ["smstemplates", "template", "title slug content"]
    ]
    const project = "context"
    const virtualFields = {
      // fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = ""
    return listAggregation(this.logModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }



}
