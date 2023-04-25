import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { EmailService } from './email.service';
import { EmailAddress, EmailAddressSchema } from './schemas/email.schema';
import { EmailController } from './email.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailAddress.name, schema: EmailAddressSchema },
    ]),
    forwardRef(() => UserModule),
    MailModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule { }
