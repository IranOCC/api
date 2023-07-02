import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Inject, Injectable, UnauthorizedException, } from '@nestjs/common';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { PhoneService } from 'src/phone/phone.service';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { OfficeService } from 'src/office/office.service';
import { ValidationError } from 'class-validator';
import { I18nValidationException, I18nService } from 'nestjs-i18n';
import { useForEnum } from 'src/utils/enum/useFor.enum';
import { ListResponseDto, PaginationDto } from 'src/utils/dto/pagination.dto';
import { listAggregation, PopulatedType, } from 'src/utils/helper/listAggregation.helper';
import { Office, OfficeDocument } from '../schemas/office.schema';
import { CreateOfficeDto } from '../dto/createOffice.dto';
import { UpdateOfficeDto } from '../dto/updateOffice.dto';







@Injectable()
export class OfficeServiceAdmin {
  constructor(
    private i18n: I18nService,
    @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    private officeService: OfficeService,
    private phoneService: PhoneService,
    private emailService: EmailService,
  ) { }


  // Create Office
  async create(data: CreateOfficeDto): Promise<any> {
    const { phone, email, management, ...props } = data
    const _office = new this.officeModel(props)

    if (management) await this.officeService.setManagement(_office, management)
    if (phone) await this.officeService.setPhone(_office, phone)
    if (email) await this.officeService.setEmail(_office, email)


    // save
    await _office.save()
    return _office
  }

  // Edit Office
  async update(id: string, data: UpdateOfficeDto): Promise<any> {
    const { phone, email, management, ...props } = data
    const _office = await this.officeModel.findById(id)

    if (management) await this.officeService.setManagement(_office, management)
    if (phone) await this.officeService.setPhone(_office, phone)
    if (email) await this.officeService.setEmail(_office, email)

    // save
    await _office.save()
    return this.officeModel.updateOne({ _id: id }, props).exec();
  }

  // List Office
  findAll(pagination: PaginationDto, filter: any, sort: any): Promise<Office[]> | void {
    const populate: PopulatedType[] = [
      ["users", "management", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
      ["phonenumbers", "phone", "value verified"],
      ["emailaddresses", "email", "value verified"],
    ]
    const project = "name description estatesCount postsCount membersCount verified active"
    const virtualFields = {
      membersCount: { $size: "$members" }
    }
    const searchFields = "name description"
    return listAggregation(this.officeModel, pagination, filter, sort, populate, project, virtualFields, searchFields)
  }



  // Get Office
  findOne(id: string) {
    return this.officeModel.findById(id)
      .populate('logo', 'path title alt')
      .populate('management', 'firstName lastName fullName')
      .populate('phone', 'value verified')
      .populate('email', 'value verified');
  }

  // Remove Single Office
  async remove(id: string) {
    await this.phoneService.removeByOffice(id);
    await this.emailService.removeByOffice(id);

    await this.officeModel.deleteOne({ _id: id })
  }


  // Remove Bulk Office
  async bulkRemove(id: string[]) {
    await this.phoneService.removeByBulkOffice(id);
    await this.emailService.removeByBulkOffice(id);

    await this.officeModel.deleteMany({ _id: { $in: id } });
  }




}
