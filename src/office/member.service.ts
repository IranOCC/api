import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { OfficeService } from './office.service';
import { Office } from './schemas/office.schema';

@Injectable()
export class MemberService {
    constructor(
        // private officeService: OfficeService,
    ) { }

    removeManagementException() {
        throw new ForbiddenException("مدیریت امکان حذف ندارد")
    }



    async find(office: Office) {
        return (await office.populate('members'))['membersWithManagement']
    }


    async add(office: Office, members: User | string | User[] | string[]) {
        const d = office

        // check is already add or not and push
        if (Array.isArray(members)) {
            members.map((item: User | string) => {
                if (item instanceof User) {
                    if (!d.members.includes(item._id)) {
                        d.members.push(item._id)
                    }
                }
                else {
                    if (!d.members.includes(item)) {
                        d.members.push(item)
                    }
                }
            })
        }
        else {
            if (members instanceof User) {
                if (!d.members.includes(members._id)) {
                    d.members.push(members._id)
                }
            }
            else {
                if (!d.members.includes(members)) {
                    d.members.push(members)
                }
            }
        }
        // save
        await d.save()
    }



    async remove(office: Office, members: User | string | User[] | string[]) {
        const d = office

        // 
        if (Array.isArray(members)) {
            members.map((item: User | string) => {
                if (item instanceof User) {
                    if (d.members.includes(item._id)) {
                        if (office.management === item._id) this.removeManagementException()
                        const _index = d.members.indexOf(item._id)
                        d.members.splice(_index, 1)
                    }
                }
                else {
                    if (d.members.includes(item)) {
                        if (office.management === item) this.removeManagementException()
                        const _index = d.members.indexOf(item)
                        d.members.splice(_index, 1)
                    }
                }
            })
        }
        else {


            if (members instanceof User) {
                if (d.members.includes(members._id)) {
                    if (office.management.equals(members._id)) this.removeManagementException()
                    const _index = d.members.indexOf(members._id)
                    d.members.splice(_index, 1)
                }
            }
            else {
                if (d.members.includes(members)) {
                    if (office.management.equals(members)) this.removeManagementException()
                    const _index = d.members.indexOf(members)
                    d.members.splice(_index, 1)
                }
            }
        }
        // save
        await d.save()
    }
}
