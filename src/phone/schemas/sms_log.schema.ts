import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { Office } from 'src/office/schemas/office.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { PhoneNumber } from './phone.schema';
import { SmsTemplate } from './sms_template.schema';

@Schema({ timestamps: true })
export class SmsLog extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneNumber',
    select: true,
  })
  phone: PhoneNumber | string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  user: User | string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    select: false,
  })
  office: Office | string | null;




  @Prop({
    type: mongoose.Schema.Types.String,
    enum: RelatedToEnum,
    default: undefined,
    select: true
  })
  relatedTo?: RelatedToEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true
  })
  relatedToID: string | null;





  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true,
    required: true,
    ref: 'SmsTemplate',
    autopopulate: { select: 'title content' }
  })
  template: SmsTemplate | string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    select: true
  })
  context: any;



  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  sentBy: User | string | null;
}

export const SmsLogSchema = SchemaFactory.createForClass(SmsLog);
export type SmsLogDocument = HydratedDocument<SmsLog>;



// plugins
SmsLogSchema.plugin(require('mongoose-autopopulate'));