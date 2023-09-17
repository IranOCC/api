import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { Storage } from 'src/storage/schemas/storage.schema';



@Schema({ timestamps: true })
export class Office extends Document {
  @Prop({ select: true, required: true, trim: true, type: String })
  name: string;

  @Prop()
  description: string;



  // @Prop({ default: 0, type: Number })
  // estatesCount: number;

  // @Prop({ default: 0, type: Number })
  // postsCount: number;



  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: true,
    autopopulate: { select: 'firstName lastName fullName' }
  })
  management: User | string | null;




  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
    select: true,
    autopopulate: { select: 'path alt title' }
  })
  logo: Storage | string | null;



  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true,
    ref: 'EmailAddress',
    autopopulate: { select: 'value verified' }
  })
  email: EmailAddress | string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true,
    ref: 'PhoneNumber',
    autopopulate: { select: 'value verified' }
  })
  phone: PhoneNumber | string | null;




  @Prop({
    type: String,
    select: false,
  })
  province: string;

  @Prop({
    type: String,
    select: false,
  })
  city: string;

  @Prop({
    type: String,
    select: false,
  })
  address: string;

  @Prop({
    index: '2dsphere',
    type: [Number, Number],
    set: (value) => {
      if (!value?.length) return null
      return value?.split(",")?.map((v: string) => +v)
    },
    get: (value) => {
      return value?.join(",")
    },
    select: false
  })
  location: [number, number] | string;



  @Prop({ default: false, select: true, })
  verified: boolean;

  @Prop({ default: true, select: true, })
  active: boolean;

  @Prop({ default: false, select: true, })
  showPublic: boolean;

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



// 
// OfficeSchema.virtual('membersWithManagement', {
//   ref: 'User',
//   localField: 'members',
//   foreignField: '_id',
//   get: function () {
//     if (!this.members) return undefined
//     return this.members.map((member) => {
//       return {
//         isManagement: member._id.equals(this.management._id),
//         ...JSON.parse(JSON.stringify(member)),
//       }
//     })
//   },
// })

OfficeSchema.virtual('membersCount', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
  get: function () {
    if (!this.members) return undefined
    return this.members.length
  },
})




// plugins
OfficeSchema.plugin(require('mongoose-autopopulate'));