
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
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


  findAll(email: EmailAddress, relatedTo?: RelatedToEnum, relatedToID?: string) {
    if (relatedTo && relatedToID) {
      return this.logModel
        .find({ email: email._id })
        .find({ relatedTo, relatedToID })
        .populate("sentBy", "fullName")
        .populate("email", "value")
        .populate("template", "content")
    }
    if (relatedTo) {
      return this.logModel
        .find({ email: email._id })
        .find({ relatedTo })
        .populate("sentBy", "fullName")
        .populate("email", "value")
        .populate("template", "content")
    }
    return this.logModel
      .find({ email: email._id })
      .populate("sentBy", "fullName")
      .populate("email", "value")
      .populate("template", "content")
  }



}
