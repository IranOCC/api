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
import { BlogPost, BlogPostDocument } from 'src/blog/post/schemas/blogPost.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Office, OfficeDocument } from 'src/office/schemas/office.schema';
import * as moment from "jalali-moment"
import { RangeDateEnum } from './enum/RangeDate.enum';
import { VisitorsReportEnum } from './enum/VisitorsReport.enum';
import { PeriodTypeEnum } from './enum/PeriodType.enum';
import { ChartModeEnum } from './enum/ChartMode.enum';
import { ObjectId } from 'mongodb';
import { TimeFrameEnum } from './enum/TimeFrame.enum';




@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }


  async myStatistics(user: User) {
    const final = [
      {
        "$group": {
          _id: null,
          total: { $sum: 1 },
          rejected: {
            $sum: {
              $cond: {
                "if": { "$eq": ["$isRejected", true] },
                "then": 1,
                "else": 0
              },
            },
          },
          confirmed: {
            $sum: {
              $cond: {
                "if": { "$eq": ["$isConfirmed", true] },
                "then": 1,
                "else": 0
              },
            },
          },
        },
      },
      {
        $addFields: {
          pending: {
            $subtract: [{ $subtract: ["$total", "$rejected"] }, "$confirmed"]
          }
        },
      },
      {
        $project: {
          _id: 0,
          total: "$total",
          rejected: "$rejected",
          confirmed: "$confirmed",
          pending: "$pending"
        },
      },
    ]

    return this.estateModel.aggregate([
      {
        $match: {
          createdBy: new ObjectId(user._id),
        }
      },
      {
        $project: {
          "_id": "$_id",
          "createdAt": "$createdAt",
          "isConfirmed": "$isConfirmed",
          "isRejected": {
            "$cond": {
              "if": { "$eq": ["$isRejected", true] },
              "then": true,
              "else": false
            },
          },
        },
      },
      {
        $facet: {
          "today": [
            {
              $match: {
                createdAt: {
                  $gte: moment().startOf("jDay").toDate(),
                  $lt: moment().endOf("jDay").toDate(),
                }
              }
            },
            ...final
          ],
          "yesterday": [
            {
              $match: {
                createdAt: {
                  $gte: moment().subtract(1, "jDay").startOf("jDay").toDate(),
                  $lt: moment().subtract(1, "jDay").endOf("jDay").toDate(),
                }
              }
            },
            ...final
          ],
          "thisMonth": [
            {
              $match: {
                createdAt: {
                  $gte: moment().startOf("jMonth").toDate(),
                  $lt: moment().endOf("jMonth").toDate(),
                }
              }
            },
            ...final
          ],
          "lastMonth": [
            {
              $match: {
                createdAt: {
                  $gte: moment().subtract(1, "jMonth").startOf("jMonth").toDate(),
                  $lt: moment().subtract(1, "jMonth").endOf("jMonth").toDate(),
                }
              }
            },
            ...final
          ],
          "all": [
            ...final
          ],
        }
      },
      {
        $project: {
          all: {
            $cond: {
              if: { $eq: [{ $size: "$all" }, 0] },
              then: {
                "total": 0,
                "rejected": 0,
                "confirmed": 0,
                "pending": 0,
              },
              else: { $first: "$all" }
            }
          },
          today: {
            $cond: {
              if: { $eq: [{ $size: "$today" }, 0] },
              then: {
                "total": 0,
                "rejected": 0,
                "confirmed": 0,
                "pending": 0,
              },
              else: { $first: "$today" }
            }
          },
          yesterday: {
            $cond: {
              if: { $eq: [{ $size: "$yesterday" }, 0] },
              then: {
                "total": 0,
                "rejected": 0,
                "confirmed": 0,
                "pending": 0,
              },
              else: { $first: "$yesterday" }
            }
          },
          thisMonth: {
            $cond: {
              if: { $eq: [{ $size: "$thisMonth" }, 0] },
              then: {
                "total": 0,
                "rejected": 0,
                "confirmed": 0,
                "pending": 0,
              },
              else: { $first: "$thisMonth" }
            }
          },
          lastMonth: {
            $cond: {
              if: { $eq: [{ $size: "$lastMonth" }, 0] },
              then: {
                "total": 0,
                "rejected": 0,
                "confirmed": 0,
                "pending": 0,
              },
              else: { $first: "$lastMonth" }
            }
          },
        },
      },

    ]).then(e => e[0])
  }


  visitorsRealtime() {
    const analyticsDataClient = new BetaAnalyticsDataClient();

    return analyticsDataClient.runRealtimeReport({
      property: `properties/${405205490}`,
      metrics: [
        { name: "activeUsers" }
      ]
    }).then((v) => ({ onlineUsers: parseInt(v?.[0]?.rows?.[0]?.metricValues?.[0]?.value || "0") }))
  }


  async firstSight() {
    return this.estateModel.aggregate([
      {
        $project: {
          "_id": "$_id",
          "createdAt": "$createdAt",
          "isConfirmed": "$isConfirmed",
          "isRejected": {
            "$cond": {
              "if": { "$eq": ["$isRejected", true] },
              "then": true,
              "else": false
            },
          },
        },
      },
      {
        "$group": {
          _id: null,
          total: { $sum: 1 },
          rejected: {
            $sum: {
              $cond: {
                "if": { "$eq": ["$isRejected", true] },
                "then": 1,
                "else": 0
              },
            },
          },
          confirmed: {
            $sum: {
              $cond: {
                "if": { "$eq": ["$isConfirmed", true] },
                "then": 1,
                "else": 0
              },
            },
          },
        },
      },
      {
        $addFields: {
          pending: {
            $subtract: [{ $subtract: ["$total", "$rejected"] }, "$confirmed"]
          }
        },
      },
      {
        $project: {
          _id: 0,
          total: "$total",
          rejected: "$rejected",
          confirmed: "$confirmed",
          pending: "$pending"
        },
      },
    ]).then(e => e[0])
  }

  async visitorsReport(report: VisitorsReportEnum, range: RangeDateEnum, timeFrame: TimeFrameEnum) {
    const analyticsDataClient = new BetaAnalyticsDataClient();

    let startDate = 'today'
    let endDate = 'today'
    let _timeFrame = 'dateHour'
    switch (range) {
      case RangeDateEnum.yesterday:
        startDate = 'yesterday'
        endDate = 'today'
        break;
      case RangeDateEnum.today:
        startDate = 'today'
        endDate = 'today'
        break;
      // ===> week
      case RangeDateEnum['7daysAgo']:
        startDate = '7daysAgo'
        endDate = 'today'
        break;
      case RangeDateEnum.thisWeek:
        startDate = moment().startOf("week").subtract(1, "jDay").locale("en").format("YYYY-MM-DD")
        endDate = moment().endOf("week").subtract(1, "jDay").locale("en").format("YYYY-MM-DD")
        break;
      case RangeDateEnum.lastWeek:
        startDate = moment().subtract(1, "week").startOf("week").subtract(1, "jDay").locale("en").format("YYYY-MM-DD")
        endDate = moment().subtract(1, "week").endOf("week").subtract(1, "jDay").locale("en").format("YYYY-MM-DD")
        break;
      // ===> month
      case RangeDateEnum['30daysAgo']:
        startDate = '30daysAgo'
        endDate = 'today'
        break;
      case RangeDateEnum.thisMonth:
        startDate = moment().startOf("jMonth").locale("en").format("YYYY-MM-DD")
        endDate = moment().endOf("jMonth").locale("en").format("YYYY-MM-DD")
        break;
      case RangeDateEnum.lastMonth:
        startDate = moment().subtract(1, "jMonth").startOf("jMonth").locale("en").format("YYYY-MM-DD")
        endDate = moment().subtract(1, "jMonth").endOf("jMonth").locale("en").format("YYYY-MM-DD")
        break;
    }

    switch (timeFrame) {
      case TimeFrameEnum.hourly:
        _timeFrame = 'dateHour'
        break;
      case TimeFrameEnum.daily:
        _timeFrame = 'date'
        break;
      case TimeFrameEnum.weekly:
        _timeFrame = 'week'
        break;
      case TimeFrameEnum.monthly:
        _timeFrame = 'month'
        break;
      case TimeFrameEnum.yearly:
        _timeFrame = 'year'
        break;

    }

    if (report === VisitorsReportEnum.visitor) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: _timeFrame,
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          if (timeFrame === TimeFrameEnum.hourly) {
            result.push({
              name: moment(value, "YYYYMMDDHH").locale("fa").format("YYYY/MM/DD HH:mm"),
              count: metricValues[0].value
            })
          }
          if (timeFrame === TimeFrameEnum.daily) {
            result.push({
              name: moment(value, "YYYYMMDD").locale("fa").format("YYYY/MM/DD HH:mm"),
              count: metricValues[0].value
            })
          }
          if (timeFrame === TimeFrameEnum.weekly) {
            result.push({
              name: moment().week(parseInt(value)).locale("fa").format("YYYY/MM/DD HH:mm"),
              count: metricValues[0].value
            })
          }
          if (timeFrame === TimeFrameEnum.monthly) {
            result.push({
              name: moment().month(parseInt(value)).locale("fa").format("YYYY/MM/DD HH:mm"),
              count: metricValues[0].value
            })
          }
          if (timeFrame === TimeFrameEnum.yearly) {
            result.push({
              name: moment().year(parseInt(value)).locale("fa").format("YYYY/MM/DD HH:mm"),
              count: metricValues[0].value
            })
          }
        })
      })
      result = result.sort((a, b) => a.name > b.name ? 1 : -1)
      return result
    }

    else if (report === VisitorsReportEnum.browser) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'browser',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.platform) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'deviceCategory',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.language) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'language',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.brand) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'mobileDeviceBranding',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.model) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'mobileDeviceMarketingName',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.mobileModel) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'mobileDeviceModel',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.os) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'operatingSystem',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.resolution) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'screenResolution',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.country) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'country',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.city) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'city',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === VisitorsReportEnum.source) {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'sessionSource',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: value, count: parseInt(metricValues[0].value) })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    return report
  }




  async estatesReport(period: PeriodTypeEnum) {
    return this.estateModel.aggregate([
      {
        $project: {
          _id: "$_id",
          time: "$publishedAt",
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
        $group: {
          _id: period === PeriodTypeEnum.daily ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
            : period === PeriodTypeEnum.weekly ? { op: { $week: "$time" }, year: { $year: "$time" } }
              : period === PeriodTypeEnum.monthly ? { op: { $month: "$time" }, year: { $year: "$time" } }
                : null
          ,
          name: {
            $first: {
              $dateToString: {
                date: "$time",
                format: "%Y-%m-%d"
              },
            }
          },
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
        $sort: {
          "name": 1
        }
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          total: "$total",
          rejected: "$rejected",
          confirmed: "$confirmed",
        }
      },
    ])
  }

  async postsReport(period: PeriodTypeEnum) {
    return this.blogPostModel.aggregate([
      {
        $project: {
          _id: "$_id",
          time: "$publishedAt",
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
        $group: {
          _id: period === PeriodTypeEnum.daily ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
            : period === PeriodTypeEnum.weekly ? { op: { $week: "$time" }, year: { $year: "$time" } }
              : period === PeriodTypeEnum.monthly ? { op: { $month: "$time" }, year: { $year: "$time" } }
                : null
          ,
          name: {
            $first: {
              $dateToString: {
                date: "$time",
                format: "%Y-%m-%d"
              },
            }
          },
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
        $sort: {
          "name": 1
        }
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          total: "$total",
          rejected: "$rejected",
          confirmed: "$confirmed",
        }
      },
    ])
  }





  async officeEstatesCountSeriesReport(mode: ChartModeEnum) {
    return this.officeModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: "$name",
        }
      },
      {
        $lookup: {
          from: "estates",
          localField: "_id",
          foreignField: "office",
          as: "datalist",
          pipeline: [
            {
              "$project": {
                "_id": "$_id",
                "isConfirmed": "$isConfirmed",
                "isRejected": {
                  "$cond": {
                    "if": { "$eq": ["$isRejected", true] },
                    "then": true,
                    "else": false
                  },
                },
              }
            },
            {
              "$group": {
                "_id": null,
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
              $project: {
                _id: 0,
                total: "$total",
                rejected: "$rejected",
                confirmed: "$confirmed",
              }
            },
          ]
        }
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          total: "$datalist.total",
          rejected: "$datalist.rejected",
          confirmed: "$datalist.confirmed",
        }
      },
      {
        $sort: {
          "total": -1
        }
      },
    ])
  }


  async officeEstatesTimeSeriesReport(period: PeriodTypeEnum) {
    return this.officeModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: "$name",
        }
      },
      {
        $lookup: {
          from: "estates",
          localField: "_id",
          foreignField: "office",
          as: "datalist",
          pipeline: [
            {
              $project: {
                _id: "$_id",
                time: "$publishedAt",
              },
            },
            {
              $group: {
                _id: period === PeriodTypeEnum.daily ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === PeriodTypeEnum.weekly ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === PeriodTypeEnum.monthly ? { op: { $month: "$time" }, year: { $year: "$time" } }
                      : null
                ,
                name: {
                  $first: {
                    $dateToString: {
                      date: "$time",
                      format: "%Y-%m-%d"
                    },
                  }
                },
                total: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$name",
                total: "$total",
              }
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $facet: {
          items: [
            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
              }
            }
          ],
          data: [
            {
              $group: {
                _id: "$datalist.name",
                object: {
                  $push: {
                    k: {
                      $toString: "$_id"
                    },
                    v: "$datalist.total"
                  }
                },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                c: { $arrayToObject: "$object" }
              }
            },
            {
              $sort: {
                "name": 1
              }
            },
            {
              $replaceWith: {
                $mergeObjects: [{ name: "$name" }, "$c"]
              }
            },
          ],
        }
      },
    ]).then(e => e[0])
  }


  async officePostsCountSeriesReport(mode: ChartModeEnum) {
    return this.officeModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: "$name",
        }
      },
      {
        $lookup: {
          from: "blogposts",
          localField: "_id",
          foreignField: "office",
          as: "datalist",
          pipeline: [
            {
              "$project": {
                "_id": "$_id",
                "isConfirmed": "$isConfirmed",
                "isRejected": {
                  "$cond": {
                    "if": { "$eq": ["$isRejected", true] },
                    "then": true,
                    "else": false
                  },
                },
              }
            },
            {
              "$group": {
                "_id": null,
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
              $project: {
                _id: 0,
                total: "$total",
                rejected: "$rejected",
                confirmed: "$confirmed",
              }
            },
          ]
        }
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          total: "$datalist.total",
          rejected: "$datalist.rejected",
          confirmed: "$datalist.confirmed",
        }
      },
      {
        $sort: {
          "total": -1
        }
      },
    ])
  }


  async officePostsTimeSeriesReport(period: PeriodTypeEnum) {
    return this.officeModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: "$name",
        }
      },
      {
        $lookup: {
          from: "blogposts",
          localField: "_id",
          foreignField: "office",
          as: "datalist",
          pipeline: [
            {
              $project: {
                _id: "$_id",
                time: "$publishedAt",
              },
            },
            {
              $group: {
                _id: period === PeriodTypeEnum.daily ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === PeriodTypeEnum.weekly ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === PeriodTypeEnum.monthly ? { op: { $month: "$time" }, year: { $year: "$time" } }
                      : null
                ,
                name: {
                  $first: {
                    $dateToString: {
                      date: "$time",
                      format: "%Y-%m-%d"
                    },
                  }
                },
                total: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$name",
                total: "$total",
              }
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $facet: {
          items: [
            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
              }
            }
          ],
          data: [
            {
              $group: {
                _id: "$datalist.name",
                object: {
                  $push: {
                    k: {
                      $toString: "$_id"
                    },
                    v: "$datalist.total"
                  }
                },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                c: { $arrayToObject: "$object" }
              }
            },
            {
              $sort: {
                "name": 1
              }
            },
            {
              $replaceWith: {
                $mergeObjects: [{ name: "$name" }, "$c"]
              }
            },
          ],
        }
      },
    ]).then(e => e[0])
  }








  async userEstatesCountSeriesReport(mode: ChartModeEnum) {
    return this.userModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: { $concat: ["$firstName", " ", "$lastName"] },
        }
      },
      {
        $lookup: {
          from: "estates",
          localField: "_id",
          foreignField: "createdBy",
          as: "datalist",
          pipeline: [
            {
              "$project": {
                "_id": "$_id",
                "isConfirmed": "$isConfirmed",
                "isRejected": {
                  "$cond": {
                    "if": { "$eq": ["$isRejected", true] },
                    "then": true,
                    "else": false
                  },
                },
              }
            },
            {
              "$group": {
                "_id": null,
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
              $project: {
                _id: 0,
                total: "$total",
                rejected: "$rejected",
                confirmed: "$confirmed",
              }
            },
          ]
        }
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          total: "$datalist.total",
          rejected: "$datalist.rejected",
          confirmed: "$datalist.confirmed",
        }
      },
      {
        $sort: {
          "total": -1
        }
      },
    ])
  }


  async userEstatesTimeSeriesReport(period: PeriodTypeEnum) {
    return this.userModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: { $concat: ["$firstName", " ", "$lastName"] },
        }
      },
      {
        $lookup: {
          from: "estates",
          localField: "_id",
          foreignField: "createdBy",
          as: "datalist",
          pipeline: [
            {
              $project: {
                _id: "$_id",
                time: "$publishedAt",
              },
            },
            {
              $group: {
                _id: period === PeriodTypeEnum.daily ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === PeriodTypeEnum.weekly ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === PeriodTypeEnum.monthly ? { op: { $month: "$time" }, year: { $year: "$time" } }
                      : null
                ,
                name: {
                  $first: {
                    $dateToString: {
                      date: "$time",
                      format: "%Y-%m-%d"
                    },
                  }
                },
                total: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$name",
                total: "$total",
              }
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $facet: {
          items: [
            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
              }
            }
          ],
          data: [
            {
              $group: {
                _id: "$datalist.name",
                object: {
                  $push: {
                    k: {
                      $toString: "$_id"
                    },
                    v: "$datalist.total"
                  }
                },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                c: { $arrayToObject: "$object" }
              }
            },
            {
              $sort: {
                "name": 1
              }
            },
            {
              $replaceWith: {
                $mergeObjects: [{ name: "$name" }, "$c"]
              }
            },
          ],
        }
      },
    ]).then(e => e[0])
  }


  async userPostsCountSeriesReport(mode: ChartModeEnum) {
    return this.userModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: { $concat: ["$firstName", " ", "$lastName"] },
        }
      },
      {
        $lookup: {
          from: "blogposts",
          localField: "_id",
          foreignField: "createdBy",
          as: "datalist",
          pipeline: [
            {
              "$project": {
                "_id": "$_id",
                "isConfirmed": "$isConfirmed",
                "isRejected": {
                  "$cond": {
                    "if": { "$eq": ["$isRejected", true] },
                    "then": true,
                    "else": false
                  },
                },
              }
            },
            {
              "$group": {
                "_id": null,
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
              $project: {
                _id: 0,
                total: "$total",
                rejected: "$rejected",
                confirmed: "$confirmed",
              }
            },
          ]
        }
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          total: "$datalist.total",
          rejected: "$datalist.rejected",
          confirmed: "$datalist.confirmed",
        }
      },
      {
        $sort: {
          "total": -1
        }
      },
    ])
  }


  async userPostsTimeSeriesReport(period: PeriodTypeEnum) {
    return this.userModel.aggregate([
      {
        $project: {
          _id: "$_id",
          name: { $concat: ["$firstName", " ", "$lastName"] },
        }
      },
      {
        $lookup: {
          from: "blogposts",
          localField: "_id",
          foreignField: "createdBy",
          as: "datalist",
          pipeline: [
            {
              $project: {
                _id: "$_id",
                time: "$publishedAt",
              },
            },
            {
              $group: {
                _id: period === PeriodTypeEnum.daily ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === PeriodTypeEnum.weekly ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === PeriodTypeEnum.monthly ? { op: { $month: "$time" }, year: { $year: "$time" } }
                      : null
                ,
                name: {
                  $first: {
                    $dateToString: {
                      date: "$time",
                      format: "%Y-%m-%d"
                    },
                  }
                },
                total: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$name",
                total: "$total",
              }
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$datalist",
        },
      },
      {
        $facet: {
          items: [
            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
              }
            }
          ],
          data: [
            {
              $group: {
                _id: "$datalist.name",
                object: {
                  $push: {
                    k: {
                      $toString: "$_id"
                    },
                    v: "$datalist.total"
                  }
                },
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                c: { $arrayToObject: "$object" }
              }
            },
            {
              $sort: {
                "name": 1
              }
            },
            {
              $replaceWith: {
                $mergeObjects: [{ name: "$name" }, "$c"]
              }
            },
          ],
        }
      },
    ]).then(e => e[0])
  }





}

