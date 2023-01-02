import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Office } from 'src/office/schemas/office.schema';
import { User } from 'src/user/schemas/user.schema';
import { Subject } from './subjects';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  private appName = process.env.APP_NAME;
  private baseApiUrl = process.env.BASE_API_URL;
  private emailVerifyUrl = process.env.EMAIL_VERIFY_URL;
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

  async resetPassword(owner: User | Office, token: string) {
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
}
