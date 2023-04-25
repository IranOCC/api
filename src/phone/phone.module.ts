import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsModule } from 'src/sms/sms.module';
import { PhoneNumber, PhoneNumberSchema } from '../phone/schemas/phone.schema';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNumber.name, schema: PhoneNumberSchema },
    ]),
    forwardRef(() => UserModule),
    SmsModule,
  ],
  providers: [PhoneService],
  exports: [PhoneService],
  controllers: [PhoneController],
})
export class PhoneModule { }
