import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema()
export class EstateCategory extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  icon: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstateCategory',
  })
  parent: any;
}

// eslint-disable-next-line prettier/prettier
export const EstateCategorySchema = SchemaFactory.createForClass(EstateCategory);
export type EstateCategoryDocument = HydratedDocument<EstateCategory>;
