import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';


@Schema({ timestamps: true })
export class SmsTemplate extends Document {
  @Prop({
    required: true,
    trim: true
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    select: true,
    required: true
  })
  content: string;
}

export const SmsTemplateSchema = SchemaFactory.createForClass(SmsTemplate);
export type SmsTemplateDocument = HydratedDocument<SmsTemplate>;



var handleE11000 = function (error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.log("gg");

    next();
  } else {
    next();
  }
};

SmsTemplateSchema.post('save', handleE11000);
SmsTemplateSchema.post('update', handleE11000);
SmsTemplateSchema.post('findOneAndUpdate', handleE11000);
SmsTemplateSchema.post('insertMany', handleE11000);

