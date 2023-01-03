import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsModule } from '../sms/sms.module';
import { PhoneNumber, PhoneNumberSchema } from '../phone/schemas/phone.schema';
import { PhoneService } from './phone.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
    SmsModule,
  ],
  providers: [PhoneService],
  exports: [PhoneService],
})
export class PhoneModule {}
