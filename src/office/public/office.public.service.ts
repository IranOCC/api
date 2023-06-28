import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { OfficeService } from 'src/office/office.service';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
import { Office, OfficeDocument } from '../schemas/office.schema';







@Injectable()
export class OfficeServicePublic {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
  ) { }




}
