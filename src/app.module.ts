import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MinioClientModule } from './minio/minio.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { MongoModule } from './mongo/mongo.module';
import { MailModule } from './mail/mail.module';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { SmsModule } from './sms/sms.module';
import { EstateModule } from './estate/estate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongoModule,
    MinioClientModule,
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
    StorageModule,
    UserModule,
    AuthModule,
    MailModule,
    SmsModule,
    EstateModule,
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
export class AppModule {}
