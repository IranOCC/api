import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('MAIL_SMTP_HOST'),
            secure: configService.get<boolean>('MAIL_SMTP_SECURE'),
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
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
