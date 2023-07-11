import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { PhoneModule } from 'src/phone/phone.module';
import { Office, OfficeSchema } from './schemas/office.schema';
import { MemberService } from './members/member.service';
import { OfficeControllerAdmin } from './admin/office.admin.controller';
import { OfficeControllerPublic } from './public/office.public.controller';
import { OfficeControllerTools } from './tools/office.tools.controller';
import { OfficeServiceAdmin } from './admin/office.admin.service';
import { OfficeServicePublic } from './public/office.public.service';
import { OfficeServiceTools } from './tools/office.tools.service';
import { MemberController } from './members/member.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
    UserModule,
    PhoneModule,
    EmailModule,
  ],
  controllers: [OfficeControllerAdmin, OfficeControllerPublic, OfficeControllerTools, MemberController],
  providers: [OfficeService, MemberService, OfficeServiceAdmin, OfficeServicePublic, OfficeServiceTools],
  exports: [OfficeService],
})
export class OfficeModule { }
