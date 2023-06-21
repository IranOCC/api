import { forwardRef, Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { PhoneModule } from 'src/phone/phone.module';
import { Office, OfficeSchema } from './schemas/office.schema';
import { UserModule } from 'src/user/user.module';
import { MemberService } from './member.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
    forwardRef(() => PhoneModule),
    forwardRef(() => EmailModule),
    forwardRef(() => UserModule),
  ],
  controllers: [OfficeController],
  providers: [OfficeService, MemberService],
  exports: [OfficeService],
})
export class OfficeModule { }
