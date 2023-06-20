import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailAddress } from 'src/email/email/schemas/email.schema';
import { Office } from 'src/office/schemas/office.schema';
import { User } from 'src/user/schemas/user.schema';
import { MailLog, MailLogDocument } from './schemas/mail_log.schema';
import { Subject } from './subjects';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(MailLog.name) private logModel: Model<MailLogDocument>,
  ) { }


  private appName = 'iranocc';
  private emailVerifyUrl = 'process.env.EMAIL_VERIFY_URL';
  private subject = new Subject();

  async welcome(owner: User | Office) {
    await this.mailerService.sendMail({
      to: owner.email,
      subject: this.subject.welcomeRegistration(),
      template: './welcome',
      context: {
        appName: this.appName,
        firstName: 'owner.firstName',
      },
    });
  }

  async verification(owner: User | Office, token: string) {
    const url = `${this.emailVerifyUrl}?token=${token}`;
    await this.mailerService.sendMail({
      to: owner.email,
      subject: this.subject.emailVerification(),
      template: './verification',
      context: {
        appName: this.appName,
        firstName: 'owner.firstName',
        url,
      },
    });
  }

  async resetPassword(owner: User, token: string) {
    const url = `${this.emailVerifyUrl}?token=${token}`;
    await this.mailerService.sendMail({
      to: owner.email,
      subject: this.subject.emailVerification(),
      template: './resetPassword',
      context: {
        appName: this.appName,
        firstName: 'owner.firstName',
        url,
      },
    });
  }


  // ***
  async sendTextMessage(email: EmailAddress, text: string, user: User) {
    await this.logModel.create({ emailID: email._id, text, sentBy: user })
    await this.mailerService.sendMail({
      to: email.value,
      text: text,
    })
    return true
  }

  async logs(email: EmailAddress) {
    return await this.logModel.find({ emailID: email._id }).populate("sentBy", ["fullName"])
  }
}
