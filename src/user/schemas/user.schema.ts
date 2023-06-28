import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document, } from 'mongoose';
import { RoleEnum } from '../../user/enum/role.enum';
import * as speakeasy from 'speakeasy';
import { PhoneNumber } from 'src/phone/schemas/phone.schema';
import { EmailAddress } from 'src/email/schemas/email.schema';
import { Storage } from 'src/storage/schemas/storage.schema';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';



@Schema({ timestamps: true })
export class User extends Document {

  @Prop({
    trim: true,
    select: true,
  })
  firstName: string;

  @Prop({
    trim: true,
    select: true,
  })
  lastName: string;

  fullName: string;

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
    select: true,
    autopopulate: { select: 'path alt title' }
  })
  avatar: Storage | string | null;




  @Prop({ default: false, select: true, })
  verified: boolean;

  @Prop({ default: true, select: true, })
  active: boolean;



  @Prop({
    default: () => speakeasy.generateSecret({ length: 10 }).base32,
    immutable: true,
    unique: true,
    select: true,
  })
  accountToken: string;

  @Prop({
    type: [{ type: String, enum: RoleEnum }],
    default: [RoleEnum.User],
    required: true,
    select: true,
  })
  roles: RoleEnum[];



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
    select: false,
  })
  location: [number, number] | string;



  @Prop({ default: Date.now, select: false, })
  lastLogin: Date;

  @Prop({ default: Date.now, select: false, })
  lastOnline: Date;
}



export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;



UserSchema.set('toObject', {
  virtuals: true,
  getters: true,
});
UserSchema.set('toJSON', {
  virtuals: true,
  getters: true,
});



// get & set fullName
UserSchema.virtual('fullName')
  .get(function () {
    return this.firstName ? this.firstName + ' ' + this.lastName : null;
  })
  .set(function (newName) {
    const nameParts = newName.split(' ');
    this.firstName = nameParts.slice(0, nameParts.length - 1).join(' ');
    this.lastName = nameParts[nameParts.length - 1];
  });





// plugins
UserSchema.plugin(require('mongoose-autopopulate'));



