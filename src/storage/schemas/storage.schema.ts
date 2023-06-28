import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';


@Schema({ timestamps: true })
export class Storage {
  @Prop({ type: String, })
  title: string;

  @Prop({ type: String, })
  alt: string;

  @Prop({ type: Number, })
  filesize: number;

  @Prop({ type: String, })
  mimetype: string;

  @Prop({ type: String, })
  dimensions: string;

  @Prop({ type: String, })
  path: string;




  @Prop({
    type: mongoose.Schema.Types.String,
    enum: RelatedToEnum,
    default: undefined,
    select: false,
  })
  relatedTo: RelatedToEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: false
  })
  relatedToID: string | null;




  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  uploadedBy: User | string | null;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
export type StorageDocument = HydratedDocument<Storage>;