import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
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

  create(createSettingDto: CreateSettingDto) {
    return 'This action adds a new setting';
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
