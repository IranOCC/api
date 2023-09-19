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

  // ==> initial
  async getInitial(): Promise<Settings> {
    return ((await this.settingsModel.findOne({ key: SettingsKeys.Initial }))?.value) || {};
  }
  async setInitial(data: InitialSettingDto): Promise<any> {
    return await this.settingsModel.updateOne(
      { key: SettingsKeys.Initial },
      { value: { ...data } },
      { upsert: true }
    );
  }


}
