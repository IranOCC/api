import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';

@Schema({ timestamps: true })
export class Office extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  personnelCount: number;

  @Prop()
  estateCount: number;

  @Prop()
  blogCount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  management: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  logo: any;

  @Prop({ type: String })
  address: string;

  @Prop({ type: { type: String } })
  location: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailAddress',
    get: (value: EmailAddress) => {
      return value.value;
    },
  })
  email: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneNumber',
    get: (value: PhoneNumber) => {
      return value.value;
    },
  })
  phone: any;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: true })
  active: boolean;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
export type OfficeDocument = HydratedDocument<Office>;
