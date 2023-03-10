import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WebsiteSettings,
  WebsiteSettingsSchema,
} from './schemas/websiteSettings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebsiteSettings.name, schema: WebsiteSettingsSchema },
    ]),
  ],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule { }
