import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Estate extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop({ required: true, trim: true })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storage',
  })
  image: any;

  @Prop()
  status: string;

  @Prop()
  visibility: string;

  @Prop()
  password: string;

  @Prop()
  publishTime: Date;

  // #
  @Prop()
  type: [string];

  @Prop()
  area: [string];

  // #

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
}

export const EstateSchema = SchemaFactory.createForClass(Estate);
export type EstateDocument = HydratedDocument<Estate>;
