import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';



@Schema({ timestamps: true })
export class Issue extends Document {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  reportBy: User | string;


  @Prop({
    type: mongoose.Schema.Types.String,
    enum: RelatedToEnum,
    default: undefined,
    select: true
  })
  relatedTo?: RelatedToEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true
  })
  relatedToID: string | null;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
export type IssueDocument = HydratedDocument<Issue>;
