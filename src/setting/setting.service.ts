import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WebsiteSettings,
  WebsiteSettingsDocument,
} from './schemas/websiteSettings.schema';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(WebsiteSettings.name)
    private websiteSettingsModel: Model<WebsiteSettingsDocument>,
  ) {
    // #
  }

  async getWebInitialData(): Promise<any> {
    return await this.websiteSettingsModel.findOne();
  }

  async getInitial(): Promise<any> {
    return await this.websiteSettingsModel.findOne();
  }

  async setInitial(): Promise<any> {
    return await this.websiteSettingsModel.updateOne({}, {});
  }
}
