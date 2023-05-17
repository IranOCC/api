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

  @Prop({
    index: '2dsphere',
    set: (value) => {
      return value.split(",").map((v: string) => +v)
    },
    get: (value) => {
      return value.join(",")
    }
  })
  location: [number, number] | string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  members: any[];
}

export const OfficeSchema = SchemaFactory.createForClass(Office);
export type OfficeDocument = HydratedDocument<Office>;

OfficeSchema.set('toObject', {
  virtuals: true,
  getters: true,
});
OfficeSchema.set('toJSON', {
  virtuals: true,
  getters: true,
});

OfficeSchema.virtual('membersWithManagement', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
  get: function () {
    if (!this.members) return undefined
    return this.members.map((member) => {
      return {
        isManagement: member._id.equals(this.management._id),
        ...JSON.parse(JSON.stringify(member)),
      }
    })
  },
})

OfficeSchema.virtual('membersCount', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
  get: function () {
    if (!this.members) return undefined
    return this.members.length
  },
})



OfficeSchema.plugin(require('mongoose-autopopulate'));
