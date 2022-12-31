import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { Subject } from './subjects';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  private appName = process.env.APP_NAME;
  private baseApiUrl = process.env.BASE_API_URL;
  private emailVerifyUrl = process.env.EMAIL_VERIFY_URL;
  private subject = new Subject();

  async welcome(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: this.subject.welcomeRegistration(),
      template: './welcome',
      context: {
        appName: this.appName,
        firstName: user.firstName,
      },
    });
  }

  async verification(user: User, token: string) {
    const url = `${this.emailVerifyUrl}?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: this.subject.emailVerification(),
      template: './verification',
      context: {
        appName: this.appName,
        firstName: user.firstName,
        url,
      },
    });
  }

  async resetPassword(user: User, token: string) {
    const url = `${this.emailVerifyUrl}?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: this.subject.emailVerification(),
      template: './resetPassword',
      context: {
        appName: this.appName,
        firstName: user.firstName,
        url,
      },
    });
  }
}
