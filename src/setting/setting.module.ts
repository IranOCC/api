import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Settings, SettingsSchema, } from './schemas/settings.schema';

import { SettingControllerAdmin } from './admin/setting.admin.controller';
import { SettingServiceAdmin } from './admin/setting.admin.service';
import { SettingController } from './public/setting.controller';
import { SettingService } from './public/setting.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
  ],
  controllers: [SettingControllerAdmin, SettingController],
  providers: [SettingServiceAdmin, SettingService],
})
export class SettingModule { }
