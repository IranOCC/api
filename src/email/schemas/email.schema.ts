import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

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

  @Prop()
  secret: string;
}
export const EmailAddressSchema = SchemaFactory.createForClass(EmailAddress);
export type EmailAddressDocument = HydratedDocument<EmailAddress>;
