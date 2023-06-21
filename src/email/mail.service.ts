import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { User } from 'src/user/schemas/user.schema';
import { MailLog, MailLogDocument } from './schemas/mail_log.schema';


@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(MailLog.name) private logModel: Model<MailLogDocument>,
  ) { }


  async sendOtpCode(email: EmailAddress, token: string) {
    this.logModel.create({ emailID: email._id, userID: email?.user || null, officeID: email?.office || null, text: ("CODE " + token), subject: "otp" })
    return await this.mailerService.sendMail({ to: email.value, text: "CODE " + token })
  }

  async sendTextMessage(email: EmailAddress, text: string, sentBy: User, subject: string, subjectID: string) {
    this.logModel.create({ emailID: email._id, userID: email?.user || null, officeID: email?.office || null, text, sentBy, subject, subjectID })
    await this.mailerService.sendMail({ to: email.value, text: text })
    return true
  }

  async logs(email: EmailAddress, subject: string, subjectID: string) {
    // PEND:test  filter
    return await this.logModel
      .find({ emailID: email._id })
      .find({ subject, subjectID })
      .populate("sentBy", ["fullName"])
  }
}
