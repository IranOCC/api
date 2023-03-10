import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';

@Schema()
export class WebsiteSettings extends Document {
    @Prop({})
    title: string;

    @Prop({})
    description: string;

    @Prop({})
    keywords: string[];
}

export const WebsiteSettingsSchema =
    SchemaFactory.createForClass(WebsiteSettings);
export type WebsiteSettingsDocument = HydratedDocument<WebsiteSettings>;
