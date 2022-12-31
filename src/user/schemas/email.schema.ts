import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmailAddress extends Document {
  @Prop({ unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: any;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  secret: string;
}
export const EmailAddressSchema = SchemaFactory.createForClass(EmailAddress);
export type EmailAddressDocument = HydratedDocument<EmailAddress>;
