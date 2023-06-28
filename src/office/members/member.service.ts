import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { OfficeService } from '../office.service';
import { Office, OfficeDocument } from '../schemas/office.schema';

@Injectable()
export class MemberService {
    constructor(
        @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    ) { }


    // === getOfficeById
    async getOfficeById(_office: Office | string): Promise<Office> {
        let office: Office
        if (_office instanceof String) office = await this.officeModel.findById(_office)
        else office = _office as Office
        if (!office) throw new NotFoundException("The office not found", "OfficeNotFound")
        return office
    }






    async add(_office: Office | string, users: User | string | User[] | string[]) {

        // get office
        const office = await this.getOfficeById(_office)


        let m = []
        if (!Array.isArray(users)) m = [users]
        else m = users

        // check is already add or not and push
        m.map((item: User | string) => {
            if (item instanceof User) {
                if (!office.members.includes(item._id)) {
                    office.members.push(item._id)
                }
            }
            else {
                if (!office.members.includes(item)) {
                    office.members.push(item)
                }
            }
        })


        // save
        await office.save()
    }


    async findAll(_office: string, pagination: PaginationDto) {
        // get office
        const office = await this.getOfficeById(_office)
        return office
    }


    async remove(_office: Office | string, users: User | string | User[] | string[]) {

        // get office
        const office = await this.getOfficeById(_office)

        let m = []
        if (!Array.isArray(users)) m = [users]
        else m = users

        // check is already add or not and push
        m.map((item: User | string) => {
            if (item instanceof User) {
                if (office.members.includes(item._id)) {
                    if (office.management === item._id) throw new NotAcceptableException("Management can not to delete", "ManagementDeleteError")
                    const _index = office.members.indexOf(item._id)
                    office.members.splice(_index, 1)
                }
            }
            else {
                if (office.members.includes(item)) {
                    if (office.management === item) throw new NotAcceptableException("Management can not to delete", "ManagementDeleteError")
                    const _index = office.members.indexOf(item)
                    office.members.splice(_index, 1)
                }
            }
        })


        // save
        await office.save()
    }
}
