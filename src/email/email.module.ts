import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAddress, EmailAddressSchema } from './schemas/email.schema';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailLog, MailLogSchema } from './schemas/mail_log.schema';
import { ConfigService } from '@nestjs/config';
import { MailController } from './mail/mail.controller';
import { I18nService } from 'nestjs-i18n';
import { MailTemplateControllerAdmin } from './mail_template/admin/mail_template.admin.controller';
import { MailTemplateControllerTools } from './mail_template/tools/mail_template.tools.controller';
import { MailTemplateServiceAdmin } from './mail_template/admin/mail_template.admin.service';
import { MailTemplateService } from './mail_template/mail_template.service';
import { MailTemplateServiceTools } from './mail_template/tools/mail_template.tools.service';
import { MailTemplate, MailTemplateSchema } from './schemas/mail_template.schema';
import { MailService } from './mail/mail.service';
import { EmailController } from './email.controller';
import { MailLogService } from './mail_log/mail_log.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailAddress.name, schema: EmailAddressSchema },
    ]),
    MongooseModule.forFeature([
      { name: MailLog.name, schema: MailLogSchema },
    ]),
    MongooseModule.forFeature([
      { name: MailTemplate.name, schema: MailTemplateSchema },
    ]),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService, i18n: I18nService) => {
        return {
          transport: {
            host: configService.get('MAIL_SMTP_HOST'),
            port: configService.get('MAIL_SMTP_PORT'),
            auth: {
              user: configService.get('MAIL_SMTP_USER'),
              pass: configService.get('MAIL_SMTP_PASSWORD'),
            },
            tls: true,
          },
          defaults: {
            from: "Iran Occasion <noreply@iranocc.com>",
          },
          // preview: true,
          // template: {
          //   dir: join(__dirname, 'templates'),
          //   adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
          //   options: {
          //     strict: true,
          //   },
          // },
        };
      },
      inject: [ConfigService, I18nService],
    })
  ],
  providers: [EmailService, MailService, MailLogService, MailTemplateService, MailTemplateServiceAdmin, MailTemplateServiceTools],
  controllers: [EmailController, MailController, MailTemplateControllerAdmin, MailTemplateControllerTools],
  exports: [EmailService],

})
export class EmailModule { }
