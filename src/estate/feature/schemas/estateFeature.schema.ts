import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema()
export class EstateFeature extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Icon',
  })
  icon: any;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Tag',
  })
  tags: any[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'EstateCategory',
  })
  categories: any[];
}

// eslint-disable-next-line prettier/prettier
export const EstateFeatureSchema = SchemaFactory.createForClass(EstateFeature);
export type EstateFeatureDocument = HydratedDocument<EstateFeature>;
