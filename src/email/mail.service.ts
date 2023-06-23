import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';
import { MailLog, MailLogDocument } from './schemas/mail_log.schema';
import { I18nService } from 'nestjs-i18n';
import { MailTemplatesEnum } from './enum/templates';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';




@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private i18n: I18nService,
    @InjectModel(MailLog.name) private logModel: Model<MailLogDocument>,
  ) { }


  async sendOtpCode(email: EmailAddress, token: string) {
    const context = { token }
    await this.mailerService.sendMail({
      to: email.value,
      subject: this.i18n.t("mail.subjects.otp"),
      template: MailTemplatesEnum.Otp,
      context,
    })
    this.logModel.create({
      emailID: email._id,
      userID: email?.user || null,
      officeID: email?.office || null,
      template: MailTemplatesEnum.Otp,
      context,
      relatedTo: RelatedToEnum.Otp || null
    })
  }

  // use $subject in context
  async sendSingleMail(email: EmailAddress, template = MailTemplatesEnum.NoTemplate, context: any = {}, sentBy: User, relatedTo?: RelatedToEnum, relatedToID?: string) {
    await this.mailerService.sendMail({
      to: email.value,
      subject: context?.$subject || this.i18n.t("mail.subjects." + template),
      template,
      context,
    })
    this.logModel.create({
      emailID: email._id,
      userID: email?.user || null,
      officeID: email?.office || null,
      template,
      context,
      relatedTo: relatedTo || undefined,
      relatedToID: relatedToID || undefined,
      sentBy: sentBy?._id || undefined
    })
  }

  async logs(email: EmailAddress, relatedTo?: RelatedToEnum, relatedToID?: string) {
    return await this.logModel
      .find({ emailID: email._id })
      .find({ relatedTo, relatedToID })
      .populate("sentBy", ["fullName"])
  }
}
