import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Injectable, } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AutoCompleteDto } from 'src/utils/dto/autoComplete.dto';
import { MailTemplate, MailTemplateDocument } from 'src/email/schemas/mail_template.schema';






@Injectable()
export class MailTemplateServiceTools {
  constructor(
    private i18n: I18nService,
    @InjectModel(MailTemplate.name) private templateModel: Model<MailTemplateDocument>
  ) { }


  async autoComplete({ initial, search, current, size }: AutoCompleteDto) {
    return await this.templateModel.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
            { _id: new mongoose.Types.ObjectId(initial) }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          title: "$title",
          value: "$_id",
          isInitial: {
            $cond: [
              { $eq: ["$_id", new mongoose.Types.ObjectId(initial)] },
              1,
              0
            ]
          }
        }
      },
      { $skip: (current - 1) * size },
      { $limit: size },
      { $sort: { isInitial: -1 } },
      { $project: { isInitial: 0 } }
    ])
  }

}
