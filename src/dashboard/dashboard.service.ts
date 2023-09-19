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




@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }


  async visitorsReport(report: string) {
    const analyticsDataClient = new BetaAnalyticsDataClient();

    if (report === "visitor") {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate: 'yesterday',
            endDate: 'today',
          },
        ],
        metrics: [
          { name: 'activeUsers', },
        ],
        dimensions: [
          {
            name: 'dateHour',
          },
        ],
      });

      let result = []
      response?.rows?.map(({ dimensionValues, metricValues }) => {
        dimensionValues.map(({ value }, idx) => {
          result.push({ name: moment(value, "YYYYMMDDHH").locale("fa").format("YYYY/MM/DD HH:mm"), count: metricValues[0].value })
        })
      })
      result = result.sort((a, b) => a.name > b.name ? 1 : -1)

      return result
    }

    else if (report === "browser") {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate: 'yesterday',
            endDate: 'today',
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
          result.push({ name: value, count: metricValues[0].value })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }

    else if (report === "platform") {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${405205490}`,
        dateRanges: [
          {
            startDate: 'yesterday',
            endDate: 'today',
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
          result.push({ name: value, count: metricValues[0].value })
        })
      })
      result = result.sort((a, b) => a.count > b.count ? -1 : 1)

      return result
    }





    // let result = {}



    // const [onlineResponse] = await analyticsDataClient.runRealtimeReport({
    //   property: `properties/${405205490}`,
    //   metrics: [{ name: 'activeUsers', },],
    // });
    // const online = parseInt(onlineResponse?.rows?.[0]?.metricValues?.[0]?.value || "0")
    // result = { online }

    // return result

    return "hiii"
  }




  async estatesReport(period: "daily" | "weekly" | "monthly") {
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
          _id: period === "daily" ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
            : period === "weekly" ? { op: { $week: "$time" }, year: { $year: "$time" } }
              : period === "monthly" ? { op: { $month: "$time" }, year: { $year: "$time" } }
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

  async postsReport(period: "daily" | "weekly" | "monthly") {
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
          _id: period === "daily" ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
            : period === "weekly" ? { op: { $week: "$time" }, year: { $year: "$time" } }
              : period === "monthly" ? { op: { $month: "$time" }, year: { $year: "$time" } }
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





  async officeEstatesCountSeriesReport(mode?: "barchart" | "piechart" | "table") {
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


  async officeEstatesTimeSeriesReport(period?: "daily" | "weekly" | "monthly") {
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
                _id: period === "daily" ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === "weekly" ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === "monthly" ? { op: { $month: "$time" }, year: { $year: "$time" } }
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


  async officePostsCountSeriesReport(mode?: "barchart" | "piechart" | "table") {
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


  async officePostsTimeSeriesReport(period?: "daily" | "weekly" | "monthly") {
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
                _id: period === "daily" ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === "weekly" ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === "monthly" ? { op: { $month: "$time" }, year: { $year: "$time" } }
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








  async userEstatesCountSeriesReport(mode?: "barchart" | "piechart" | "table") {
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


  async userEstatesTimeSeriesReport(period?: "daily" | "weekly" | "monthly") {
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
                _id: period === "daily" ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === "weekly" ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === "monthly" ? { op: { $month: "$time" }, year: { $year: "$time" } }
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


  async userPostsCountSeriesReport(mode?: "barchart" | "piechart" | "table") {
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


  async userPostsTimeSeriesReport(period?: "daily" | "weekly" | "monthly") {
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
                _id: period === "daily" ? { op: { $dayOfYear: "$time" }, year: { $year: "$time" } }
                  : period === "weekly" ? { op: { $week: "$time" }, year: { $year: "$time" } }
                    : period === "monthly" ? { op: { $month: "$time" }, year: { $year: "$time" } }
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

