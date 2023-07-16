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
        title: { disabled: false },
        slug: { disabled: false },
        excerpt: { disabled: false },
        content: { disabled: false },
        gallery: { disabled: false },
        image: { disabled: false },
        category: { disabled: false },
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
          default: user._id,
        },
        office: {
          disabled: false,
          default: user.offices[0]._id,
        },

        code: { disabled: false },
        province: { disabled: false, default: "گیلان" },
        city: { disabled: false, default: "رشت" },
        district: { disabled: false },
        quarter: { disabled: false },
        alley: { disabled: false },
        location: { disabled: false, default: [55.333, 33.666] },

        price: { disabled: false },
        totalPrice: { disabled: false },
        description: { disabled: false },
        canBarter: { disabled: false },
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
      if (!doc) throw new NotFoundException("Post not found", "PostNotFound")

      if (
        user.roles.includes(RoleEnum.SuperAdmin)
        ||
        user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id))
        ||
        user.roles.includes(RoleEnum.Agent) && doc.createdBy.equals(user._id) && (doc.office.members.includes(user._id))
      ) {
        return {
          allowSubmit: true,
          allowConfirm: user.roles.includes(RoleEnum.SuperAdmin) || user.roles.includes(RoleEnum.Admin) && ((doc.office.management as User)._id.equals(user._id)),
          title: { disabled: false },
          slug: { disabled: false },
          excerpt: { disabled: false },
          content: { disabled: false },
          gallery: { disabled: false },
          image: { disabled: false },
          category: { disabled: false },
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
          location: { disabled: false },

          price: { disabled: false },
          totalPrice: { disabled: false },
          description: { disabled: false },
          canBarter: { disabled: false },
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
        location: { disabled: true },

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
