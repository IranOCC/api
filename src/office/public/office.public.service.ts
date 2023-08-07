import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { OfficeService } from 'src/office/office.service';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
import { Office, OfficeDocument } from '../schemas/office.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType } from 'src/utils/helper/listAggregation.helper';







@Injectable()
export class OfficeServicePublic {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }


  // List Office
  findAll(pagination: PaginationDto) {
    const populate: PopulatedType[] = [
      ["users", "management", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["phonenumbers", "phone", "value verified"],
      ["emailaddresses", "email", "value verified"],
      ["storages", "logo", "path alt title", false],
    ]
    const project = "name description verified"
    const virtualFields = {}
    const searchFields = "name description"
    let filter = {}
    filter["showPublic"] = true
    return listAggregation(this.officeModel, pagination, filter, undefined, populate, project, virtualFields, searchFields, undefined, undefined, undefined)
  }

}
