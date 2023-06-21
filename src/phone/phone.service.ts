import { BadRequestException, forwardRef, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { PhoneOtpConfirmDto } from 'src/auth/dto/phoneOtpConfirm.dto';
import { SendSmsDto } from './dto/sendSms.dto';
import { UserService } from 'src/user/user.service';
import { GetSmsLogsDto } from './dto/getSmsLogs.dto';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { Office } from 'src/office/schemas/office.schema';
import { SmsService } from './sms.service';
import { PhoneNumber, PhoneNumberDocument } from './schemas/phone.schema';
import { User } from 'src/user/schemas/user.schema';
import { generateToken, validationToken } from 'src/utils/helper/token.helper';
import { OfficeService } from 'src/office/office.service';

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(PhoneNumber.name) private model: Model<PhoneNumberDocument>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => OfficeService)) private officeService: OfficeService,
    private smsService: SmsService,
  ) { }


  // setup phone
  async setup(value: string, useFor: useForEnum = useForEnum.User, owner: User | Office, verified = false): Promise<any> {
    const check = await this.model.findOne({ value }).select(["value", "verified", "user", "office"]).populate(['office', 'user']);

    let _query: PhoneNumber;

    if (check) {
      if (useFor === useForEnum.Office && ((!check.user && !check.office) || owner._id.equals(check.office._id))) {
        _query = check;
        _query.office = owner._id
        _query.user = null
      }
      else if (useFor === useForEnum.User && ((!check.user && !check.office) || owner._id.equals(check.user._id))) {
        _query = check;
        _query.office = null
        _query.user = owner._id
      }
      else {
        throw 'Exists';
      }
    } else {
      _query = new this.model({ value, verified });
      if (useFor === useForEnum.User) _query.user = owner._id;
      if (useFor === useForEnum.Office) _query.office = owner._id;
    }

    _query.verified = !!verified

    await _query.save();
    return _query;
  }



  // find phone
  async find(value: string, useFor: useForEnum = useForEnum.User) {
    const data = await this.model
      .findOne({ value })
      .select(['user', 'office'])
      .exec();
    if (!data) throw 'Not found';
    return data;
  }



  // send otp
  async sendOtpCode(phone: string) {
    const _query = await this.model
      .findOne({ value: phone })
      .select(['secret', 'value', 'user', 'office'])
      .exec();
    const token = generateToken(_query.secret);
    return await this.smsService.sendOtpCode(_query, token);
  }

  // confirm otp
  async confirmOtpCode({ phone, token }: PhoneOtpConfirmDto) {
    const _query = await this.model
      .findOne({ value: phone })
      .select(['secret'])
      .exec();
    const isValid = validationToken(_query.secret, token);
    // if not verified => do verify
    if (isValid) await this.doVerify(phone)
    return isValid
  }

  // verify phone
  async doVerify(phone: string) {
    const _query = await this.model
      .findOne({ value: phone })
      .exec();
    // if not verified => do verify
    if (!_query.verified) {
      _query.verified = true
      await _query.save()
    }
  }




  // send sms
  async sendSms(data: SendSmsDto, sentBy: User) {
    let _phone: PhoneNumber | null = null
    if (data.userID) {
      const u = await this.userService.findOne(data.userID).populate("phone", ["user"])
      if (!u || !u?.phone) {
        throw new NotFoundException({ error: "PhoneNumberNotFound", message: "Phone number not found" })
      }
      _phone = u.phone
    }
    else if (data.officeID) {
      const o = await this.officeService.findOne(data.officeID).populate("phone", ["user"])
      if (!o || !o?.phone) {
        throw new NotFoundException({ error: "PhoneNumberNotFound", message: "Phone number not found" })
      }
      _phone = o.phone
    }
    else if (data.phoneID) {
      const phone = await this.model.findById(data.phoneID).select(["user"])
      if (!phone) throw new NotFoundException({ error: "PhoneNumberNotFound", message: "Phone number not found" })
      _phone = phone
    }
    else {
      throw new NotAcceptableException({ error: "PhoneNumberInvalid", message: "Phone number invalid" })
    }

    // ==> send
    return await this.smsService.sendTextMessage(_phone, data.text, sentBy, data.subject, data.subjectID)
  }

  // get sms logs
  async getSmsLogs(data: GetSmsLogsDto) {
    let _phone = null
    if (data.userID) {
      const u = await this.userService.findOne(data.userID)
      if (!u || !u?.phone) {
        throw new NotFoundException({ error: "PhoneNumberNotFound", message: "Phone number not found" })
      }
      _phone = u.phone
    }
    else if (data.officeID) {
      const o = await this.officeService.findOne(data.officeID)
      if (!o || !o?.phone) {
        throw new NotFoundException({ error: "PhoneNumberNotFound", message: "Phone number not found" })
      }
      _phone = o.phone
    }
    else if (data.phoneID) {
      const phone = await this.model.findById(data.phoneID)
      if (!phone) throw new NotFoundException({ error: "PhoneNumberNotFound", message: "Phone number not found" })
      _phone = phone
    }
    else {
      throw new NotAcceptableException({ error: "PhoneNumberInvalid", message: "Phone number invalid" })
    }

    // logs
    return await this.smsService.logs(_phone, data.subject, data.subjectID)
  }


  // remove
  async remove(id: string): Promise<any> {
    return this.model.deleteOne({ _id: id })
  }



}
