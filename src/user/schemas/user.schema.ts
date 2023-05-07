import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document, } from 'mongoose';
import { RoleEnum } from '../../user/enum/role.enum';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;
import * as speakeasy from 'speakeasy';



@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ trim: true, select: true, })
  firstName: string;

  @Prop({ trim: true, select: true, })
  lastName: string;

  fullName: string;


  @Prop({ select: false })
  password: string;

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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
    autopopulate: true
  })
  avatar: any;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({
    default: () => speakeasy.generateSecret({ length: 10 }).base32,
    immutable: true,
    unique: true,
  })
  accountToken: string;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: Date.now })
  lastOnline: Date;

  @Prop()
  deletedAt: Date;

  @Prop({
    type: [{ type: String, enum: RoleEnum }],
    default: [RoleEnum.User],
    required: true,
  })
  roles: RoleEnum[];

  checkPassword: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const _this = this;
  if (this.isModified('password')) {
    bcrypt.hash(this.password, saltRounds, function (err: any, hashed: string) {
      if (err) return next(Error('SYSTEM_ERROR'));
      _this.password = hashed;
      return next();
    });
  } else return next();
});

UserSchema.methods.checkPassword = async function (password: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err: any, isMatch: boolean) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};


UserSchema.plugin(require('mongoose-autopopulate'));




UserSchema.set('toObject', {
  virtuals: true,
  getters: true,
});
UserSchema.set('toJSON', {
  virtuals: true,
  getters: true,
});

UserSchema.virtual('fullName')
  .get(function () {
    return this.firstName ? this.firstName + ' ' + this.lastName : null;
  })
  .set(function (newName) {
    const nameParts = newName.split(' ');
    this.firstName = nameParts.slice(0, nameParts.length - 1).join(' ');
    this.lastName = nameParts[nameParts.length - 1];
  });

// UserSchema.virtual('isManagement', {
//   ref: "Office",
//   localField: "_id",
//   foreignField: "management",
//   justOne: true,
// })

UserSchema.virtual('phoneNumber')
  .get(function () {
    return this.phone ? this.phone.value : null;
  })

UserSchema.virtual('emailAddress')
  .get(function () {
    return this.email ? this.email.value : null;
  })

