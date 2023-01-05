import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema()
export class EstateDocumentType extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  slug: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'EstateCategory',
  })
  categories: any[];
}

// eslint-disable-next-line prettier/prettier
export const EstateDocumentTypeSchema = SchemaFactory.createForClass(EstateDocumentType);
export type EstateDocumentTypeDocument = HydratedDocument<EstateDocumentType>;
