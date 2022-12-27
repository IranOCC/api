import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type StorageDocument = HydratedDocument<Storage>;

@Schema({ timestamps: true })
export class Storage {
  @Prop()
  title: string;

  @Prop()
  bucket: string;

  @Prop()
  filename: string;

  @Prop()
  filesize: number;

  @Prop()
  mimetype: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  uploadedBy: User;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
