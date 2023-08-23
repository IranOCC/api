import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { Estate } from 'src/estate/estate/schemas/estate.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class EstateFavorite extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estate',
  })
  estate: Estate | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User | string;
}

export const EstateFavoriteSchema = SchemaFactory.createForClass(EstateFavorite);
export type EstateFavoriteDocument = HydratedDocument<EstateFavorite>;
