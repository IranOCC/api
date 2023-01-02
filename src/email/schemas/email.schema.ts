import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import * as speakeasy from 'speakeasy';

@Schema({ timestamps: true })
export class EmailAddress extends Document {
  @Prop({ unique: true, trim: true, lowercase: true })
  value: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
  })
  office: any;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  verifiedAt: Date;

  @Prop({
    default: () => speakeasy.generateSecret({ length: 30 }).base32,
    immutable: true,
    unique: true,
    required: true,
  })
  secret: string;
}
export const EmailAddressSchema = SchemaFactory.createForClass(EmailAddress);
export type EmailAddressDocument = HydratedDocument<EmailAddress>;
