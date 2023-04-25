import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import * as speakeasy from 'speakeasy';

@Schema({ timestamps: true })
export class SmsLog extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneNumber',
  })
  phoneID: any;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  text: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  sentBy: any;
}

export const SmsLogSchema = SchemaFactory.createForClass(SmsLog);
export type SmsLogDocument = HydratedDocument<SmsLog>;
