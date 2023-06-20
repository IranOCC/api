import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class SmsLog extends Document {


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneNumber',
    select: false,
  })
  phoneID: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  userID: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    select: false,
  })
  officeID: any;



  @Prop({
    type: mongoose.Schema.Types.String,
  })
  subject: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  subjectID: any;



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
