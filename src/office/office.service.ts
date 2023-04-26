import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return this.officeModel.create(data);
  }

  findAll(): Promise<Office[]> {
    return this.officeModel.find().exec();
  }

  findOne(id: string) {
    return this.officeModel.findById(id);
  }

  update(id: string, data: UpdateOfficeDto): Promise<any> {
    return this.officeModel.updateOne({ _id: id }, data).exec();
  }

  remove(id: string): Promise<any> {
    return this.officeModel.deleteOne({ _id: id }).exec();
  }
}
