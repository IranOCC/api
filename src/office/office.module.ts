import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { PhoneModule } from 'src/phone/phone.module';
import { Office, OfficeSchema } from './schemas/office.schema';
import { OfficeMemberAdminService } from './members/admin/member.admin.service';
import { OfficeControllerAdmin } from './admin/office.admin.controller';
import { OfficeControllerPublic } from './public/office.public.controller';
import { OfficeControllerTools } from './tools/office.tools.controller';
import { OfficeServiceAdmin } from './admin/office.admin.service';
import { OfficeServicePublic } from './public/office.public.service';
import { OfficeServiceTools } from './tools/office.tools.service';
import { OfficeMemberAdminController } from './members/admin/member.admin.controller';
import { UserModule } from 'src/user/user.module';
import { OfficeMemberControllerTools } from './members/tools/member.tools.controller';
import { OfficeMemberServiceTools } from './members/tools/member.tools.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
    UserModule,
    PhoneModule,
    EmailModule,
  ],
  controllers: [OfficeControllerAdmin, OfficeControllerPublic, OfficeControllerTools, OfficeMemberAdminController, OfficeMemberControllerTools],
  providers: [OfficeService, OfficeServiceAdmin, OfficeServicePublic, OfficeServiceTools, OfficeMemberAdminService, OfficeMemberServiceTools],
  exports: [OfficeService],
})
export class OfficeModule { }
