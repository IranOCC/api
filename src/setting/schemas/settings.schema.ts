import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { InitialSettingDto } from '../dto/initialSetting.dto';
import { SettingsKeys } from '../enum/settingKeys.enum';

@Schema()
export class Settings extends Document {
    @Prop({ required: true, type: String, enum: SettingsKeys, })
    key: SettingsKeys;

    @Prop({ required: true, type: InitialSettingDto })
    value: any;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
export type SettingsDocument = HydratedDocument<Settings>;
