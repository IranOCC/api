import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { PhoneModule } from 'src/phone/phone.module';
import { Office, OfficeSchema } from './schemas/office.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Office.name, schema: OfficeSchema }]),
    PhoneModule,
    EmailModule,
  ],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
