import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';
import { MailLog, MailLogDocument } from './schemas/mail_log.schema';
import { I18nService } from 'nestjs-i18n';




@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private i18n: I18nService,
    @InjectModel(MailLog.name) private logModel: Model<MailLogDocument>,
  ) { }


  async sendOtpCode(email: EmailAddress, token: string) {
    const context = { token }
    const template = "otp"
    await this.mailerService.sendMail({
      to: email.value,
      subject: this.i18n.t("mail.subjects.OTP"),
      template,
      context,
    })
    this.logModel.create({ emailID: email._id, userID: email?.user || null, officeID: email?.office || null, template, parameters: context, subject: "otp" })
  }

  async sendTextMessage(email: EmailAddress, text: string, sentBy: User, subject: string, subjectID: string) {
    await this.mailerService.sendMail({ to: email.value, text: text })
    this.logModel.create({ emailID: email._id, userID: email?.user || null, officeID: email?.office || null, text, sentBy, subject, subjectID })
  }

  async logs(email: EmailAddress, subject: string, subjectID: string) {
    // PEND:test  filter
    return await this.logModel
      .find({ emailID: email._id })
      .find({ subject, subjectID })
      .populate("sentBy", ["fullName"])
  }
}
