import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { forwardRef, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { MailLog, MailLogSchema } from './schemas/mail_log.schema';

@Module({
  imports: [
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
    MongooseModule.forFeature([
      { name: MailLog.name, schema: MailLogSchema },
    ]),
    forwardRef(() => EmailModule)
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule { }
