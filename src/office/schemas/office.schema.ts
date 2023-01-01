import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

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

  @Prop()
  address: string;

  @Prop({ type: { type: String } })
  location: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: true })
  active: boolean;
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
export type OfficeDocument = HydratedDocument<Office>;
