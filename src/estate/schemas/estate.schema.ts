import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { EstateStatusEum } from '../enum/estateStatus.enum';
import { EstateVisibilityEum } from '../enum/estateVisibility.enum';

@Schema({ timestamps: true })
export class Estate extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  content: string;

  @Prop()
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
    enum: EstateStatusEum,
    default: EstateStatusEum.Pending,
  })
  status: EstateStatusEum;

  @Prop({
    type: String,
    enum: EstateVisibilityEum,
    default: EstateVisibilityEum.Public,
  })
  visibility: EstateVisibilityEum;

  @Prop({ select: false })
  password: string;

  @Prop({ default: false })
  pinned: boolean;

  @Prop({ default: Date.now })
  publishedAt: Date;


  @Prop({ select: false, })
  deletedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  createdBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  confirmedBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    select: false,
  })
  office: any;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'EstateCategory',
  })
  categories: any[];

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

  @Prop({ index: '2dsphere' })
  location: [number, number];

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Storage',
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
  })
  features: any[];

  // ####

  @Prop({ type: Number })
  constructionYear: number;

  @Prop({ type: Number })
  roomsCount: number;

  @Prop({ type: Number })
  mastersCount: number;

  @Prop({ type: Number })
  buildingArea: number;

  @Prop({ type: Number })
  floorsCount: number;

  @Prop({ type: Number })
  unitsCount: number;

  @Prop({ type: Number })
  floor: number;

  @Prop({ type: Boolean })
  withOldBuilding: boolean;
}

export const EstateSchema = SchemaFactory.createForClass(Estate);
export type EstateDocument = HydratedDocument<Estate>;
