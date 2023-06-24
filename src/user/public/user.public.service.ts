import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { OfficeService } from 'src/office/office.service';
import { I18nValidationException, I18nService } from 'nestjs-i18n';







@Injectable()
export class UserServicePublic {
  constructor(
    private i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }




}
