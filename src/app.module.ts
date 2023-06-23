import * as path from 'path';

// tools
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderResolver, I18nModule, QueryResolver, } from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

// app
import { AppController } from './app.controller';
import { AppService } from './app.service';

// auth
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';


// modules
import { UserModule } from './user/user.module';
import { OfficeModule } from './office/office.module';
import { StorageModule } from './storage/storage.module';
import { EstateModule } from './estate/estate.module';
import { BlogModule } from './blog/blog.module';
import { SettingModule } from './setting/setting.module';
import { IconModule } from './icon/icon.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
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
        // TODO: add based on user selection in db (not important for now)
      ],
    }),
    AuthModule,
    UserModule,
    OfficeModule,
    StorageModule,
    IconModule,
    BlogModule,
    SettingModule,

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware)
  }
}
