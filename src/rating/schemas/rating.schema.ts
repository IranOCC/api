import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { BlogPost } from 'src/blog/post/schemas/blogPost.schema';
import { Estate } from 'src/estate/estate/schemas/estate.schema';
import { Page } from 'src/page/schemas/page.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { number } from 'yargs';

@Schema({ timestamps: true })
export class Rating extends Document {
  @Prop({
    type: mongoose.Schema.Types.String,
    enum: RelatedToEnum,
    default: null,
    required: true
  })
  relatedTo: RelatedToEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true
  })
  relatedToID: string | null;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User | string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
export type RatingDocument = HydratedDocument<Rating>;
