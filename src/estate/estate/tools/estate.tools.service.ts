import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, NotAcceptableException, NotFoundException, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { translateStatics } from 'src/utils/helper/translateStatics.helper';
import { SmsTemplate, SmsTemplateDocument } from 'src/phone/schemas/sms_template.schema';
import { listAutoComplete } from 'src/utils/helper/autoComplete.helper';
import { Estate, EstateDocument } from '../schemas/estate.schema';
import { EstateVisibilityEnum } from '../enum/estateVisibility.enum';
import { EstateStatusEnum } from '../enum/estateStatus.enum';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { RoleEnum } from 'src/user/enum/role.enum';






@Injectable()
export class EstateToolsService {
  constructor(
    private i18n: I18nService,
    @InjectModel(Estate.name) private estateModel: Model<EstateDocument>,
  ) { }


  async autoComplete(query: AutoCompleteDto) {
    const searchFields = "title slug excerpt content"
    const displayPath = "title"
    return await listAutoComplete(this.estateModel, query, searchFields, displayPath)
  }




  async autoCompleteTotalPrice() {
    return this.estateModel.aggregate([
      {
        $project: { val: "$price" }
      },
      {
        $group: {
          "_id": {
            $switch: {
              branches: [
                { case: { $and: [{ $gte: ["$val", 0] }, { $lt: ["$val", 500e6] }] }, then: { title: "0 تا 500 میلیون", value: 0 + "_" + 500e6, s: 0 } },
                { case: { $and: [{ $gte: ["$val", 500e6] }, { $lt: ["$val", 1000e6] }] }, then: { title: "500 میلیون تا 1 میلیارد", value: 500e6 + "_" + 1000e6, s: 500e6 } },
                { case: { $and: [{ $gte: ["$val", 1000e6] }, { $lt: ["$val", 2000e6] }] }, then: { title: "1 میلیارد تا 2 میلیارد", value: 1000e6 + "_" + 2000e6, s: 1000e6 } },
                { case: { $and: [{ $gte: ["$val", 2000e6] }, { $lt: ["$val", 4000e6] }] }, then: { title: "2 میلیارد تا 4 میلیارد", value: 2000e6 + "_" + 4000e6, s: 2000e6 } },
                { case: { $and: [{ $gte: ["$val", 4000e6] }, { $lt: ["$val", 6000e6] }] }, then: { title: "4 میلیارد تا 6 میلیارد", value: 4000e6 + "_" + 6000e6, s: 4000e6 } },
                { case: { $and: [{ $gte: ["$val", 6000e6] }, { $lt: ["$val", 8000e6] }] }, then: { title: "6 میلیارد تا 8 میلیارد", value: 6000e6 + "_" + 8000e6, s: 6000e6 } },
                { case: { $and: [{ $gte: ["$val", 8000e6] }, { $lt: ["$val", 10000e6] }] }, then: { title: "8 میلیارد تا 10 میلیارد", value: 8000e6 + "_" + 10000e6, s: 8000e6 } },
                { case: { $and: [{ $gte: ["$val", 10000e6] }, { $lt: ["$val", 12500e6] }] }, then: { title: "10 میلیارد تا 12.5 میلیارد", value: 10000e6 + "_" + 12500e6, s: 10000e6 } },
                { case: { $and: [{ $gte: ["$val", 12500e6] }, { $lt: ["$val", 15000e6] }] }, then: { title: "12.5 میلیارد تا 15 میلیارد", value: 12500e6 + "_" + 15000e6, s: 12500e6 } },
                { case: { $and: [{ $gte: ["$val", 15000e6] }, { $lt: ["$val", 20000e6] }] }, then: { title: "15 میلیارد تا 20 میلیارد", value: 15000e6 + "_" + 20000e6, s: 15000e6 } },
                { case: { $and: [{ $gte: ["$val", 20000e6] }, { $lt: ["$val", 30000e6] }] }, then: { title: "20 میلیارد تا 30 میلیارد", value: 20000e6 + "_" + 30000e6, s: 20000e6 } },
                { case: { $and: [{ $gte: ["$val", 30000e6] }, { $lt: ["$val", 40000e6] }] }, then: { title: "30 میلیارد تا 40 میلیارد", value: 30000e6 + "_" + 40000e6, s: 30000e6 } },
                { case: { $and: [{ $gte: ["$val", 40000e6] }, { $lt: ["$val", 50000e6] }] }, then: { title: "40 میلیارد تا 50 میلیارد", value: 40000e6 + "_" + 50000e6, s: 40000e6 } },
                { case: { $and: [{ $gte: ["$val", 50000e6] }, { $lt: ["$val", 100000e6] }] }, then: { title: "50 میلیارد تا 100 میلیارد", value: 50000e6 + "_" + 100000e6, s: 50000e6 } },
                { case: { $and: [{ $gte: ["$val", 100000e6] }, { $lt: ["$val", 200000e6] }] }, then: { title: "100 میلیارد تا 200 میلیارد", value: 100000e6 + "_" + 200000e6, s: 100000e6 } },
                { case: { $and: [{ $gte: ["$val", 200000e6] }, { $lt: ["$val", 500000e6] }] }, then: { title: "200 میلیارد تا 500 میلیارد", value: 200000e6 + "_" + 500000e6, s: 200000e6 } },
              ],
              default: { title: "500 میلیارد به بالا", value: 500000e6 + "_" + 1000000e6, s: 200000e6 }
            },
          },
        },
      },
      {
        $sort: { "_id.s": 1 }
      },
      {
        "$project": {
          "_id": 0,
          "value": "$_id.value",
          "title": "$_id.title",
        },
      },
    ]);
  }

  async autoCompletePrice() {
    return this.estateModel.aggregate([
      {
        $project: { val: "$price" }
      },
      {
        $group: {
          "_id": {
            $switch: {
              branches: [
                { case: { $and: [{ $gte: ["$val", 0] }, { $lt: ["$val", 10e6] }] }, then: { title: "0 تا 10 میلیون", value: 0 + "_" + 10e6, s: 0 } },
                { case: { $and: [{ $gte: ["$val", 10e6] }, { $lt: ["$val", 20e6] }] }, then: { title: "10 تا 20 میلیون", value: 10e6 + "_" + 20e6, s: 10e6 } },
                { case: { $and: [{ $gte: ["$val", 20e6] }, { $lt: ["$val", 40e6] }] }, then: { title: "20 تا 40 میلیون", value: 20e6 + "_" + 40e6, s: 20e6 } },
                { case: { $and: [{ $gte: ["$val", 40e6] }, { $lt: ["$val", 70e6] }] }, then: { title: "40 تا 70 میلیون", value: 40e6 + "_" + 70e6, s: 40e6 } },
                { case: { $and: [{ $gte: ["$val", 70e6] }, { $lt: ["$val", 100e6] }] }, then: { title: "70 تا 100 میلیون", value: 70e6 + "_" + 100e6, s: 70e6 } },
                { case: { $and: [{ $gte: ["$val", 100e6] }, { $lt: ["$val", 200e6] }] }, then: { title: "100 تا 200 میلیون", value: 100e6 + "_" + 200e6, s: 100e6 } },
              ],
              default: { title: "200 میلیون به بالا", value: 200e6 + "_" + 1000e6, s: 200e6 }
            },
          },
        },
      },
      {
        $sort: { "_id.s": 1 }
      },
      {
        "$project": {
          "_id": 0,
          "value": "$_id.value",
          "title": "$_id.title",
        },
      },
    ]);
  }

  async autoCompleteArea() {
    return this.estateModel.aggregate([
      {
        $project: { val: "$area" }
      },
      {
        $group: {
          "_id": {
            $switch: {
              branches: [
                { case: { $and: [{ $gte: ["$val", 0] }, { $lt: ["$val", 100] }] }, then: { title: "0 تا 100 متر", value: "0_100", s: 0 } },
                { case: { $and: [{ $gte: ["$val", 100] }, { $lt: ["$val", 200] }] }, then: { title: "100 تا 200 متر", value: "100_200", s: 100 } },
                { case: { $and: [{ $gte: ["$val", 200] }, { $lt: ["$val", 300] }] }, then: { title: "200 تا 300 متر", value: "200_300", s: 200 } },
                { case: { $and: [{ $gte: ["$val", 300] }, { $lt: ["$val", 500] }] }, then: { title: "300 تا 500 متر", value: "300_500", s: 300 } },
                { case: { $and: [{ $gte: ["$val", 500] }, { $lt: ["$val", 1000] }] }, then: { title: "500 تا 1000 متر", value: "500_1000", s: 500 } },
                { case: { $and: [{ $gte: ["$val", 1000] }, { $lt: ["$val", 2000] }] }, then: { title: "1000 تا 2000 متر", value: "1000_2000", s: 1000 } },
                { case: { $and: [{ $gte: ["$val", 2000] }, { $lt: ["$val", 5000] }] }, then: { title: "2000 تا 5000 متر", value: "2000_5000", s: 2000 } },
                { case: { $and: [{ $gte: ["$val", 5000] }, { $lt: ["$val", 10000] }] }, then: { title: "5000 تا 10000 متر", value: "5000_10000", s: 5000 } },
                { case: { $and: [{ $gte: ["$val", 10000] }, { $lt: ["$val", 50000] }] }, then: { title: "10000 تا 50000 متر", value: "10000_50000", s: 10000 } },
                { case: { $and: [{ $gte: ["$val", 50000] }, { $lt: ["$val", 100000] }] }, then: { title: "50000 تا 100000 متر", value: "50000_100000", s: 50000 } },
              ],
              default: { title: "100000 متر به بالا", value: "100000_1000000", s: 100000 }
            },
          },
        },
      },
      {
        $sort: { "_id.s": 1 }
      },
      {
        "$project": {
          "_id": 0,
          "value": "$_id.value",
          "title": "$_id.title",
        },
      },
    ]);
  }





  async autoCompleteProvince() {
    return await this.estateModel.aggregate([
      {
        "$group": {
          "_id": "$province",
        }
      },
      {
        "$project": {
          "_id": false,
          "title": "$_id",
          "value": "$_id",
        }
      }
    ]);
  }

  async autoCompleteCity(province?: string) {
    return await this.estateModel.aggregate([
      {
        "$match": {
          province
        }
      },
      {
        "$group": {
          "_id": "$city",
        }
      },
      {
        "$project": {
          "_id": false,
          "title": "$_id",
          "value": "$_id",
        }
      }
    ]);
  }

  async autoCompleteDistrict(province?: string, city?: string) {
    return await this.estateModel.aggregate([
      {
        "$match": {
          province,
          city
        }
      },
      {
        "$group": {
          "_id": "$district",
        }
      },
      {
        "$project": {
          "_id": false,
          "title": "$_id",
          "value": "$_id",
        }
      }
    ]);
  }


  statics(subject: string) {
    const data = { visibility: EstateVisibilityEnum, status: EstateStatusEnum }
    return translateStatics(this.i18n, `estate.${subject}`, data[subject]) || {}
  }


  // actions: create update findOne find remove
  async checking(user: CurrentUser, action: string, id?: string) {

    // check my offices if not superAdmin
    if (!user.roles.includes(RoleEnum.SuperAdmin)) {
      if (!user?.offices?.length) throw new NotAcceptableException("You are not member of any office", "NoOffice")
    }

    if (action === "create") {
      return {
        allowSubmit: true,
        allowSelectCategory: true,
        allowConfirm: false,
        title: { disabled: false },
        slug: { disabled: false },
        excerpt: { disabled: false },
        content: { disabled: false },
        gallery: { disabled: false },
        image: { disabled: false },
        category: { disabled: true },
        tags: { disabled: false },
        status: {
          disabled: false,
          default: EstateStatusEnum.Publish,
        },
        visibility: {
          disabled: false,
          default: EstateVisibilityEnum.Public,
        },
        pinned: {
          disabled: false,
          default: false,
        },
        publishedAt: {
          disabled: false,
          default: new Date().toISOString(),
        },

        owner: {
          disabled: false,
          default: "64e08fd8de9b0246b1f52dc5",
        },
        office: {
          disabled: false,
          default: user.offices[0]._id,
        },

        code: { disabled: false },
        province: { disabled: false, default: "مازندران" },
        city: { disabled: false, default: "چالوس" },
        district: { disabled: false },
        quarter: { disabled: false },
        alley: { disabled: false },
        location: {
          disabled: false, default: "36.699735, 51.196246"
        },

        price: { disabled: false },
        totalPrice: { disabled: false },
        description: { disabled: false },
        canBarter: { disabled: false },

        canSwap: { disabled: false },
        special: { disabled: !user.roles.includes(RoleEnum.SuperAdmin) },
        nearPlaces: { disabled: false },
        dailyRent: { disabled: false },
        rentPricePerDay: { disabled: false },
        annualRent: { disabled: false },
        rentPricePerMonth: { disabled: false },
        mortgagePrice: { disabled: false },


        area: { disabled: false },

        type: { disabled: false },
        documentType: { disabled: false },
        features: { disabled: false },

        constructionYear: { disabled: false },
        roomsCount: { disabled: false },
        mastersCount: { disabled: false },
        buildingArea: { disabled: false },
        floorsCount: { disabled: false },
        unitsCount: { disabled: false },
        floor: { disabled: false },
        withOldBuilding: { disabled: false },
      }
    }

    if (action === "update") {
      const doc = await this.estateModel.findById(id).populate("office")
      if (!doc) throw new NotFoundException("Estate not found", "EstateNotFound")

      if (
        user.roles.includes(RoleEnum.SuperAdmin)
        ||
        user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id))
        ||
        user.roles.includes(RoleEnum.Agent) && doc.createdBy.equals(user._id) && (doc.office.members.includes(user._id))
      ) {
        return {
          allowSubmit: true,
          allowSelectCategory: false,
          allowConfirm: user.roles.includes(RoleEnum.SuperAdmin) || (user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id))),
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          gallery: { disabled: false },
          image: { disabled: false },
          category: { disabled: true },
          tags: { disabled: false },
          status: { disabled: false },
          visibility: { disabled: false },
          pinned: { disabled: false },
          publishedAt: { disabled: false },

          owner: { disabled: false },
          office: { disabled: false },

          code: { disabled: false },
          province: { disabled: false },
          city: { disabled: false },
          district: { disabled: false },
          quarter: { disabled: false },
          alley: { disabled: false },
          location: { disabled: false, default: "36.699735, 51.196246" },

          price: { disabled: false },
          totalPrice: { disabled: false },
          description: { disabled: false },
          canBarter: { disabled: false },

          canSwap: { disabled: false },
          special: { disabled: !user.roles.includes(RoleEnum.SuperAdmin) },
          nearPlaces: { disabled: false },
          dailyRent: { disabled: false },
          rentPricePerDay: { disabled: false },
          annualRent: { disabled: false },
          rentPricePerMonth: { disabled: false },
          mortgagePrice: { disabled: false },

          area: { disabled: false },

          type: { disabled: false },
          documentType: { disabled: false },
          features: { disabled: false },

          constructionYear: { disabled: false },
          roomsCount: { disabled: false },
          mastersCount: { disabled: false },
          buildingArea: { disabled: false },
          floorsCount: { disabled: false },
          unitsCount: { disabled: false },
          floor: { disabled: false },
          withOldBuilding: { disabled: false },
        }
      }

      return {
        allowSubmit: false,
        allowSelectCategory: false,
        allowConfirm: false,
        title: { disabled: true },
        slug: { disabled: true },
        excerpt: { disabled: true },
        content: { disabled: true },
        gallery: { disabled: true },
        image: { disabled: true },
        category: { disabled: true },
        tags: { disabled: true },
        status: { disabled: true },
        visibility: { disabled: true },
        pinned: { disabled: true },
        publishedAt: { disabled: true },

        owner: { disabled: true },
        office: { disabled: true },

        code: { disabled: true },
        province: { disabled: true },
        city: { disabled: true },
        district: { disabled: true },
        quarter: { disabled: true },
        alley: { disabled: true },
        location: { disabled: true, default: "36.699735, 51.196246" },

        price: { disabled: true },
        totalPrice: { disabled: true },
        description: { disabled: true },
        canBarter: { disabled: true },
        area: { disabled: true },

        type: { disabled: true },
        documentType: { disabled: true },
        features: { disabled: true },

        constructionYear: { disabled: true },
        roomsCount: { disabled: true },
        mastersCount: { disabled: true },
        buildingArea: { disabled: true },
        floorsCount: { disabled: true },
        unitsCount: { disabled: true },
        floor: { disabled: true },
        withOldBuilding: { disabled: true },
      }
    }

  }

}
