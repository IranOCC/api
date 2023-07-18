import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CurrentUser, User } from 'src/user/schemas/user.schema';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { OfficeService } from '../../office.service';
import { Office, OfficeDocument } from '../../schemas/office.schema';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { RoleEnum } from 'src/user/enum/role.enum';
import { ObjectId } from 'mongodb';

@Injectable()
export class OfficeMemberAdminService {
    constructor(
        @InjectModel(Office.name) private officeModel: Model<OfficeDocument>,
    ) { }


    // === getOfficeById
    async getOfficeById(_office: Office | string): Promise<Office> {
        let office: Office
        console.log();

        if (typeof _office === "string") office = await this.officeModel.findById(_office)
        else office = _office as Office
        if (!office) throw new NotFoundException("The office not found", "OfficeNotFound")
        return office
    }






    async add(_office: Office | string, users: User | string | User[] | string[], user?: CurrentUser) {

        // get office
        const office = await this.getOfficeById(_office)

        const mngID = (office.management as User)._id

        if (user && !user.roles.includes(RoleEnum.SuperAdmin) && user.roles.includes(RoleEnum.Admin) && !new ObjectId(mngID).equals(new ObjectId(user._id))) {
            throw new ForbiddenException("You can not add members to this office", "ForbiddenAddOfficeMembers")
        }


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
        if (typeof _office === "string") await office.save()
    }


    async findAll(_office: string, pagination: PaginationDto, user: CurrentUser) {
        // get office
        const office = await this.getOfficeById(_office)
        const mngID = (office.management as User)._id

        if (!user.roles.includes(RoleEnum.SuperAdmin) && user.roles.includes(RoleEnum.Admin) && !new ObjectId(mngID).equals(new ObjectId(user._id))) {
            throw new ForbiddenException("You can not get members of this office", "ForbiddenGetOfficeMembers")
        }


        const populate: PopulatedType[] = [
            // ["users", "management", "firstName lastName fullName", false, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
            ["users", "members", "firstName lastName roles verified fullName", true, [{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }]],
        ]
        const project = "name members management"
        const virtualFields = {
            // membersCount: { $size: "$members" }
        }
        const searchFields = "fullName"
        const filter = {}

        const newRoot = "members"
        const newRootPipelines = [
            {
                $addFields: {
                    "members.isManagement": {
                        $cond: {
                            if: { $eq: ["$members._id", "$management"] },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ]

        let filterRoot: any = { _id: { $eq: new mongoose.Types.ObjectId(_office) } }
        return listAggregation(this.officeModel, pagination, filter, undefined, populate, project, virtualFields, searchFields, filterRoot, newRoot, newRootPipelines)
    }


    async remove(_office: Office | string, users: User | string | User[] | string[], user: CurrentUser) {

        // get office
        const office = await this.getOfficeById(_office)
        const mngID = (office.management as User)._id

        if (!user.roles.includes(RoleEnum.SuperAdmin) && user.roles.includes(RoleEnum.Admin) && !new ObjectId(mngID).equals(new ObjectId(user._id))) {
            throw new ForbiddenException("You can not remove members of this office", "ForbiddenRemoveOfficeMembers")
        }

        let m = []
        if (!Array.isArray(users)) m = [users]
        else m = users



        // check is already add or not and push
        m.map((item: User | string) => {
            if (item instanceof User) {
                if (office.members.includes(item._id)) {
                    if (new mongoose.Types.ObjectId(item._id).equals(mngID)) throw new NotAcceptableException("Management can not to delete", "ManagementDeleteError")
                    const _index = office.members.indexOf(item._id)
                    office.members.splice(_index, 1)
                }
            }
            else {
                if (office.members.includes(item)) {
                    if (new mongoose.Types.ObjectId(item).equals(mngID)) throw new NotAcceptableException("Management can not to delete", "ManagementDeleteError")
                    const _index = office.members.indexOf(item)
                    office.members.splice(_index, 1)
                }
            }
        })


        // save
        await office.save()
    }
}
