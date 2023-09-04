import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { Ga4Service } from '@aurelle/nestjs-ga4';
import { BetaAnalyticsDataClient } from "@google-analytics/data"
import { google } from "googleapis"





@Injectable()
export class DashboardService {
  constructor(
    private ga4Service: Ga4Service,
  ) { }


  async sessionReport() {
    const analyticsDataClient = new BetaAnalyticsDataClient();

    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${405205490}`,
      // dateRanges: [
      //   {
      //     startDate: '2020-03-31',
      //     endDate: 'today',
      //   },
      // ],
      // dimensions: [
      //   {
      //     name: 'age',
      //   },
      // ],
      // dimensions: [{ name: 'city', },],
      metrics: [{ name: 'activeUsers', },],
    });

    console.log('Report result:');
    console.log(response);
    const onlineUsers = response?.rows?.[0]?.metricValues?.[0]?.value || 0
    return {
      onlineUsers
    }
  }

}
