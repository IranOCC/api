import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneNumber, PhoneNumberSchema } from 'src/phone/schemas/phone.schema';
import { PhoneService } from './phone.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
  ],
  providers: [PhoneService],
  exports: [PhoneService],
})
export class PhoneModule {}
