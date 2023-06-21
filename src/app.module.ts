import * as path from 'path';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeaderResolver, I18nModule, QueryResolver, } from 'nestjs-i18n';
import { APP_GUARD } from '@nestjs/core';

import { MongoModule } from './mongo/mongo.module';

// app
import { AppController } from './app.controller';
import { AppService } from './app.service';

// auth
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

// modules
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';
// import { OfficeModule } from './office/office.module';
import { BlogModule } from './blog/blog.module';
import { SettingModule } from './setting/setting.module';
// import { EmailModule } from './email/email.module';
// import { PhoneModule } from './phone/phone.module';
// import { MailModule } from './mail/mail.module';
// import { SmsModule } from './phone/sms/sms.module';
import { IconModule } from './icon/icon.module';
import { OfficeModule } from './office/office.module';
import { EmailModule } from './email/email.module';
import { PhoneModule } from './phone/phone.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongoModule,
    I18nModule.forRoot({
      fallbackLanguage: 'fa',
      loaderOptions: {
        path: path.join(__dirname, '/utils/i18n/'),
        watch: true,
        includeSubfolders: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-client-lang'])
      ],
    }),
    AuthModule,
    UserModule,
    OfficeModule,
    PhoneModule,
    EmailModule,
    StorageModule,

    EstateModule,
    BlogModule,
    SettingModule,
    IconModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware)
  }
}
