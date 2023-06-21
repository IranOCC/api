import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAddress, EmailAddressSchema } from './schemas/email.schema';
import { UserModule } from 'src/user/user.module';
import { EmailService } from './email.service';
import { OfficeModule } from 'src/office/office.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailLog, MailLogSchema } from './schemas/mail_log.schema';
import { ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailAddress.name, schema: EmailAddressSchema },
    ]),
    MongooseModule.forFeature([
      { name: MailLog.name, schema: MailLogSchema },
    ]),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('MAIL_SMTP_HOST'),
            secure: configService.get<boolean>('MAIL_SMTP_SECURE'),
            port: configService.get('MAIL_SMTP_PORT'),
            auth: {
              user: configService.get('MAIL_SMTP_USER'),
              pass: configService.get('MAIL_SMTP_PASSWORD'),
            },
            tls: { rejectUnauthorized: false },
          },
          defaults: {
            from: configService.get('MAIL_SMTP_FROM'),
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => OfficeModule),
    forwardRef(() => UserModule),
  ],
  providers: [EmailService, MailService],
  exports: [EmailService],
  controllers: [MailController],
})
export class EmailModule { }
