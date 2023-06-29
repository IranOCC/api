import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingControllerAdmin } from './admin/setting.admin.controller';
import { SettingServiceAdmin } from './admin/setting.admin.service';
import {
  Settings,
  SettingsSchema,
} from './schemas/settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  controllers: [SettingControllerAdmin],
  providers: [SettingServiceAdmin],
})
export class SettingModule { }
