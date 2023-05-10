import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class EstateCategory extends Document {
  @Prop({ required: true, })
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstateCategory',
  })
  parent: any;
}


export const EstateCategorySchema = SchemaFactory.createForClass(EstateCategory);
export type EstateCategoryDocument = HydratedDocument<EstateCategory>;
