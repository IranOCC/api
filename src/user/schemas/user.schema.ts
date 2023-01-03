import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { RoleEnum } from '../../user/enum/role.enum';
import { UserStatusEum } from '../../user/enum/userStatus.enum';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;
import * as speakeasy from 'speakeasy';
import { PhoneNumber } from '../phone/schemas/phone.schema';
import { EmailAddress } from '../email/schemas/email.schema';
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  avatar: any;

  @Prop({
    default: () => speakeasy.generateSecret({ length: 10 }).base32,
    immutable: true,
    unique: true,
    required: true,
  })
  accountToken: string;

  @Prop({
    type: String,
    enum: UserStatusEum,
    default: UserStatusEum.Active,
  })
  status: UserStatusEum;

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

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Office',
  })
  office: any[];

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

UserSchema.set('toObject', { virtuals: true, getters: true });
UserSchema.set('toJSON', { virtuals: true, getters: true });

UserSchema.virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function (newName) {
    const nameParts = newName.split(' ');
    this.firstName = nameParts.slice(0, nameParts.length - 1).join(' ');
    this.lastName = nameParts[nameParts.length - 1];
  });
