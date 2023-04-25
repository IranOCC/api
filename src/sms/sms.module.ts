

import { forwardRef, Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { PhoneModule } from 'src/phone/phone.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsLog, SmsLogSchema } from './schemas/smsLog.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SmsLog.name, schema: SmsLogSchema },
        ]),
        forwardRef(() => PhoneModule)
    ],
    providers: [SmsService],
    exports: [SmsService],
    controllers: [SmsController],
})
export class SmsModule { }