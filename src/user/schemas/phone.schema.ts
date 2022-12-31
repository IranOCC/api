import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class PhoneNumber extends Document {
  @Prop({ unique: true, trim: true })
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: any;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  secret: string;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);
export type PhoneNumberDocument = HydratedDocument<PhoneNumber>;
