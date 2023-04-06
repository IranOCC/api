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
    const { email, phone, ..._data } = data;
    const office = new this.officeModel(_data);

    // => phone & email
    let autoVerify: boolean, mustVerify: boolean;
    if (data instanceof CreateUserDto) {
      autoVerify = false;
      mustVerify = false;
    } else {
      autoVerify = false;
      mustVerify = true;
    }
    if (email) {
      office.email = (
        await this.emailService.setup(email, office, autoVerify, mustVerify)
      )._id;
    }
    if (phone) {
      // office.phone = (
      //   await this.phoneService.setup(phone, office, autoVerify, mustVerify)
      // )._id;
    }
    return await office.save();
  }

  findAll() {
    return `This action returns all office`;
  }

  findOne(id) {
    return `This action returns a #${id} office`;
  }

  update(id: string, data: UpdateOfficeDto): Promise<any> {
    return this.officeModel.updateOne({ _id: id }, data).exec();
  }

  remove(id) {
    return `This action removes a #${id} office`;
  }
}
