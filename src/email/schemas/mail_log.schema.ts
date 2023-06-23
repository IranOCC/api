import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
import { Office } from 'src/office/schemas/office.schema';
import { User } from 'src/user/schemas/user.schema';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { MailTemplatesEnum } from '../enum/templates';
import { EmailAddress } from './email.schema';

@Schema({ timestamps: true })
export class MailLog extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailAddress',
    select: true,
  })
  email: EmailAddress | string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  })
  user: User | string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    select: false,
  })
  office: Office | string | null;




  @Prop({
    type: mongoose.Schema.Types.String,
    enum: RelatedToEnum,
    default: undefined,
    select: true,
  })
  relatedTo: RelatedToEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    select: true
  })
  relatedToID: string | null;




  @Prop({
    type: mongoose.Schema.Types.String,
    enum: MailTemplatesEnum,
    default: MailTemplatesEnum.NoTemplate,
    select: true
  })
  template: MailTemplatesEnum;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    select: true
  })
  context: any;





  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  sentBy: User | string | null;
}

export const MailLogSchema = SchemaFactory.createForClass(MailLog);
export type MailLogDocument = HydratedDocument<MailLog>;
