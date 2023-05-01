import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { useForEnum } from 'src/auth/enum/useFor.enum';
import { BlogPost } from 'src/blog/modules/post/schemas/blogPost.schema';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { Estate } from 'src/estate/schemas/estate.schema';
import { PhoneDto } from 'src/phone/dto/phone.dto';
import { PhoneService } from 'src/phone/phone.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { User } from 'src/user/schemas/user.schema';
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
    const { phone, email, management, ...modelData } = data
    const _office: Office = new this.officeModel(modelData)
    // 
    if (phone) await this.setPhone(_office, phone)
    if (email) await this.setEmail(_office, email)
    if (management) await this.setManagement(_office, management)

    // save
    await _office.save()
    return _office;
  }

  async update(id: string, data: UpdateOfficeDto): Promise<any> {
    const { phone, email, management, ...modelData } = data
    const _office: Office = await this.officeModel.findById(id)
    // 
    if (phone) await this.setPhone(_office, phone)
    if (email) await this.setEmail(_office, email)
    if (management) await this.setManagement(_office, management)

    // save
    return this.officeModel.updateOne({ _id: id }, modelData).exec();
  }

  findAll(): Promise<Office[]> {
    return this.officeModel.find().exec();
  }

  findOne(id: string) {
    return this.officeModel.findById(id);
  }

  remove(id: string): Promise<any> {
    return this.officeModel.deleteOne({ _id: id }).exec();
  }

  // ==================> tools <====================

  // ======> management
  async setPhone(office: Office | string, phone: PhoneDto) {
    // try {
    //   const phoneID = await this.phoneService.setup(phone.value, useForEnum.Office, office, phone.verified)
    //   office.phone = phoneID
    //   await office.save()
    // } catch (error) {
    //   throw new BadRequestException({
    //     errors: [
    //       {
    //         property: "phone.value",
    //         constraints: { "IsAlreadyExists": "این شماره قبلا ثبت شده است" }
    //       }
    //     ]
    //   })
    // }
  }
  async setEmail(office: Office | string, email: EmailDto) {
    // try {
    //   const emailID = await this.emailService.setup(email.value, useForEnum.Office, _office, email.verified)
    //   _office.email = emailID
    //   await _office.save()
    // } catch (error) {
    //   throw new BadRequestException({
    //     errors: [
    //       {
    //         property: "email.value",
    //         constraints: { "IsAlreadyExists": "این ایمیل قبلا ثبت شده است" }
    //       }
    //     ]
    //   })
    // }
  }

  // ======> management
  async setManagement(office: Office | string, management: User | string) {
    // get user
    // is admin?
    // set admin
    // add member
  }


  // ======> members
  async addMember(office: Office | string, members: User | string | User[] | string[]) {
    // check is not an member before?
    // set member
    // plus members
  }
  async removeMember(office: Office | string, members: User | string | User[] | string[]) {

  }



  // ======> estates
  async addEstate(office: Office | string, estates: Estate | string | Estate[] | string[]) {

  }
  async removeEstate(office: Office | string, estates: Estate | string | Estate[] | string[]) {

  }


  // ======> posts
  async addPost(office: Office | string, posts: BlogPost | string | BlogPost[] | string[]) {

  }
  async removePost(office: Office | string, posts: BlogPost | string | BlogPost[] | string[]) {

  }


}
