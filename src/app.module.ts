import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { MongoModule } from './mongo/mongo.module';
import * as path from 'path';
import {
  // AcceptLanguageResolver,
  // CookieResolver,
  // HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { EstateModule } from './estate/estate.module';
import { OfficeModule } from './office/office.module';
import { BlogModule } from './blog/blog.module';
import { SettingModule } from './setting/setting.module';
import { AwsModule } from './aws/aws.module';
import { EmailModule } from './email/email.module';
import { PhoneModule } from './phone/phone.module';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { IconModule } from './icon/icon.module';
import { TagService } from './tag/tag.service';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongoModule,
    I18nModule.forRoot({
      fallbackLanguage: 'fa',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
        includeSubfolders: true,
      },
      // viewEngine: 'hbs',
      resolvers: [
        new QueryResolver(['lang', 'l']),
        // new HeaderResolver(['x-custom-lang']),
        // new CookieResolver(),
        // AcceptLanguageResolver,
      ],
    }),
    AuthModule,
    UserModule,
    PhoneModule,
    SmsModule,
    EmailModule,
    MailModule,
    StorageModule,
    OfficeModule,
    EstateModule,
    BlogModule,
    SettingModule,
    AwsModule,
    IconModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
