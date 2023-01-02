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

  @Prop()
  deletedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  confirmedBy: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
  })
  office: any;

  @Prop()
  tags: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'EstateCategory',
  })
  categories: any[];

  // @@@@

  @Prop()
  code: string;

  @Prop()
  city: string;

  @Prop()
  district: string;

  @Prop()
  quarter: string;

  @Prop()
  alley: string;

  @Prop()
  location: string;

  @Prop()
  price: number;

  @Prop()
  totalPrice: number;

  @Prop()
  description: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Storage',
  })
  gallery: any[];

  @Prop({ default: false })
  canBarter: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: any;

  @Prop()
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
