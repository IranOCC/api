import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InitialSettingDto } from '../dto/initialSetting.dto';
import {
  Settings,
  SettingsDocument,
} from '../schemas/settings.schema';
import { SettingsKeys } from '../enum/settingKeys.enum';

@Injectable()
export class SettingServiceAdmin {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {
    // #
  }

  async getWebInitialData(): Promise<any> {
    return await this.get(SettingsKeys.Initial);
  }

  // ==> initial
  async get(key: SettingsKeys): Promise<Settings> {
    return ((await this.settingsModel.findOne({ key }))?.value) || {};
  }
  async set(key: SettingsKeys, data: InitialSettingDto): Promise<any> {
    const old = await this.get(SettingsKeys.Initial);
    return await this.settingsModel.updateOne({ key }, { value: { ...old, ...data } }, { upsert: true });
  }


}
