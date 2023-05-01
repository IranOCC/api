import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { CreateOfficeDto } from './dto/createOffice.dto';
import { UpdateOfficeDto } from './dto/updateOffice.dto';
import { Office, OfficeDocument } from './schemas/office.schema';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) { }

  async create(data: CreateOfficeDto): Promise<Office> {
    const { phone, email, ...modelData } = data
    const _office = new this.officeModel(modelData)
    if (phone) {
      try {
        const phoneID = await this.phoneService.setup(phone.value, useForEnum.Office, _office, phone.verified)
        _office.phone = phoneID
      } catch (error) {
        throw new BadRequestException({
          errors: [
            {
              property: "phone.value",
              constraints: { "IsAlreadyExists": "این شماره قبلا ثبت شده است" }
            }
          ]
        })
      }
    }
    if (email) {
      try {
        const emailID = await this.emailService.setup(email.value, useForEnum.Office, _office, email.verified)
        _office.email = emailID
      } catch (error) {
        throw new BadRequestException({
          errors: [
            {
              property: "email.value",
              constraints: { "IsAlreadyExists": "این ایمیل قبلا ثبت شده است" }
            }
          ]
        })
      }
    }
    await _office.save()
    return _office;
  }

  findAll(): Promise<Office[]> {
    return this.officeModel.find().exec();
  }

  findOne(id: string) {
    return this.officeModel.findById(id);
  }

  async update(id: string, data: UpdateOfficeDto): Promise<any> {
    const { phone, email, ...modelData } = data
    const _office = await this.officeModel.findById(id)
    if (phone) {
      try {
        const phoneID = await this.phoneService.setup(phone.value, useForEnum.Office, _office, phone.verified)
        _office.phone = phoneID
        await _office.save()
      } catch (error) {
        throw new BadRequestException({
          errors: [
            {
              property: "phone.value",
              constraints: { "IsAlreadyExists": "این شماره قبلا ثبت شده است" }
            }
          ]
        })
      }
    }
    if (email) {
      try {
        const emailID = await this.emailService.setup(email.value, useForEnum.Office, _office, email.verified)
        _office.email = emailID
        await _office.save()
      } catch (error) {
        throw new BadRequestException({
          errors: [
            {
              property: "email.value",
              constraints: { "IsAlreadyExists": "این ایمیل قبلا ثبت شده است" }
            }
          ]
        })
      }
    }
    return this.officeModel.updateOne({ _id: id }, modelData).exec();
  }

  remove(id: string): Promise<any> {
    return this.officeModel.deleteOne({ _id: id }).exec();
  }
}
