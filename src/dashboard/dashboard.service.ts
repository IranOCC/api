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
  ) { }


  async sessionReport() {
    const analyticsDataClient = new BetaAnalyticsDataClient();

    let result = {}

    const [onlineResponse] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${405205490}`,
      metrics: [{ name: 'activeUsers', },],
    });
    const online = parseInt(onlineResponse?.rows?.[0]?.metricValues?.[0]?.value || "0")
    result = { online }


    const [todayResponse] = await analyticsDataClient.runReport({
      property: `properties/${405205490}`,
      dateRanges: [
        {
          startDate: 'yesterday',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'firstUserSource',
        },
      ],
      metrics: [{ name: 'activeUsers', },],
    });


    todayResponse?.rows?.map(({ dimensionValues, metricValues }) => {
      dimensionValues.map(({ value }, idx) => {
        result[value === "(direct)" ? "direct" : value || "others"] = parseInt(metricValues[idx].value || "0")
      })
    })



    console.log(todayResponse);

    return result
  }

}
