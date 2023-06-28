
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';
import { EmailAddress } from '../schemas/email.schema';
import { MailLog, MailLogDocument } from '../schemas/mail_log.schema';
import { MailTemplate } from '../schemas/mail_template.schema';


@Injectable()
export class MailLogService {

  constructor(
    @InjectModel(MailLog.name) private logModel: Model<MailLogDocument>
  ) { }



  create(email: EmailAddress, context: any = {}, template: MailTemplate, sentBy?: User, relatedTo?: RelatedToEnum, relatedToID?: string) {
    return this.logModel.create({
      email: email._id,
      user: email?.user || null,
      office: email?.office || null,

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
      ["emailaddresses", "email", "value"],
      ["mailtemplates", "template", "title content"],
    ]
    const project = "context"
    const virtualFields = {
      // fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
    const searchFields = ""
    return listAggregation(this.logModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }



}
