import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { EstateStatusEnum } from '../enum/estateStatus.enum';
import { EstateVisibilityEnum } from '../enum/estateVisibility.enum';
import { EstateCategory } from 'src/estate/category/schemas/estateCategory.schema';

@Schema({ timestamps: true })
export class Estate extends Document {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  excerpt: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  image: any;

  @Prop({
    type: String,
    enum: EstateStatusEnum,
    default: EstateStatusEnum.Pending,
  })
  status: EstateStatusEnum;

  @Prop({
    type: String,
    enum: EstateVisibilityEnum,
    default: EstateVisibilityEnum.Public,
  })
  visibility: EstateVisibilityEnum;

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // select: false,
  })
  createdBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // select: false,
  })
  confirmedBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    // select: false,
  })
  office: any;

  @Prop({
    type: [String],
    default: []
  })
  tags: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstateCategory',
    default: null
  })
  category: EstateCategory;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstateType',
    default: null
  })
  type: any;

  // @@@@

  @Prop({ type: String })
  code: string;

  @Prop({ type: String, })
  province: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  district: string;

  @Prop({ type: String })
  quarter: string;

  @Prop({ type: String })
  alley: string;

  @Prop({ type: String, })
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
    }
  })
  location: [number, number] | string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Storage',
    default: []
  })
  gallery: any[];

  @Prop({ type: Boolean, default: false })
  canBarter: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: any;

  @Prop({ type: Number })
  area: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstateDocumentType',
  })
  documentType: any;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'EstateFeature',
    default: []
  })
  features: any[];

  // ####

  @Prop({ type: Number, default: null })
  constructionYear: number;

  @Prop({ type: Number, default: null })
  roomsCount: number;

  @Prop({ type: Number, default: null })
  mastersCount: number;

  @Prop({ type: Number, default: null })
  buildingArea: number;

  @Prop({ type: Number, default: null })
  floorsCount: number;

  @Prop({ type: Number, default: null })
  unitsCount: number;

  @Prop({ type: Number, default: null })
  floor: number;

  @Prop({ type: Boolean, default: null })
  withOldBuilding: boolean;
}

export const EstateSchema = SchemaFactory.createForClass(Estate);
export type EstateDocument = HydratedDocument<Estate>;



EstateSchema.set('toObject', {
  virtuals: true,
  getters: true,
});
EstateSchema.set('toJSON', {
  virtuals: true,
  getters: true,
});
