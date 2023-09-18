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
import { Estate, EstateDocument } from 'src/estate/estate/schemas/estate.schema';





@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
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




  async estatesReport(period: "daily" | "weekly" | "monthly" = "daily") {
    const abbas = () => {
      return "date"
      // console.log(date, "%%%");

      // return new Date(date)
      // return moment(date).locale("fa").format("DD MMM YYYY HH:mm:ss")
    }



    return this.estateModel.aggregate([
      {
        $project: {
          _id: "$_id",
          // time: {
          //   $dateToString: {
          //     date: "$createdAt",
          //     format: "%Y-%m-%d"
          //   }
          // },
          createdAt: "$createdAt",
          isConfirmed: "$isConfirmed",
          isRejected: {
            $cond: {
              "if": { "$eq": ["$isRejected", true] },
              "then": true,
              "else": false
            },
          },
        },
      },
      {
        $sort: {
          "createdAt": 1
        }
      },
      {
        $group: {
          _id: period === "daily" ? { op: { $dayOfYear: "$createdAt" }, year: { $year: "$createdAt" } }
            : period === "weekly" ? { op: { $week: "$createdAt" }, year: { $year: "$createdAt" } }
              : period === "monthly" ? { op: { $month: "$createdAt" }, year: { $year: "$createdAt" } }
                : null
          ,
          name: { $first: "$createdAt" },
          total: { $sum: 1 },
          rejected: {
            $sum: {
              "$cond": {
                "if": { "$eq": ["$isRejected", true] },
                "then": 1,
                "else": 0
              },
            },
          },
          confirmed: {
            $sum: {
              "$cond": {
                "if": { "$eq": ["$isConfirmed", true] },
                "then": 1,
                "else": 0
              },
            },
          },
        },
      },
      {
        $skip: 6900
      },
      {
        $limit: 200
      }
    ])
  }
}


