import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { EmailAddress } from '../../email/schemas/email.schema';
import { PhoneNumber } from '../../phone/schemas/phone.schema';

@Schema({ timestamps: true })
export class Office extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  membersCount: number;

  @Prop({ default: 0 })
  estatesCount: number;

  @Prop({ default: 0 })
  postsCount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  })
  management: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
    autopopulate: true
  })
  logo: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true,
    ref: 'EmailAddress',
    autopopulate: true
  })
  email: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true,
    ref: 'PhoneNumber',
    autopopulate: true
  })
  phone: any;

  @Prop({ type: String, })
  province: string;

  @Prop({ type: String, })
  city: string;

  @Prop({ type: String, })
  address: string;

  @Prop({ index: '2dsphere' })
  location: [number, number, number];

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  })
  members: any[];
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
export type OfficeDocument = HydratedDocument<Office>;



OfficeSchema.virtual('phoneNumber')
  .get(function () {
    return this.phone ? this.phone.value : null;
  })

OfficeSchema.virtual('emailAddress')
  .get(function () {
    return this.email ? this.email.value : null;
  })



OfficeSchema.plugin(require('mongoose-autopopulate'));
