import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import * as speakeasy from 'speakeasy';

@Schema({ timestamps: true })
export class MailLog extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailAddress',
  })
  emailID: any;

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

export const MailLogSchema = SchemaFactory.createForClass(MailLog);
export type MailLogDocument = HydratedDocument<MailLog>;
