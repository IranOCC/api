import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IconControllerAdmin } from './admin/icon.admin.controller';
import { IconServiceAdmin } from './admin/icon.admin.service';
import { Icon, IconSchema } from './schemas/icon.schema';
import { IconControllerTools } from './tools/icon.tools.controller';
import { IconServiceTools } from './tools/icon.tools.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Icon.name, schema: IconSchema }]),
  ],
  controllers: [IconControllerAdmin, IconControllerTools],
  providers: [IconServiceAdmin, IconServiceTools]
})
export class IconModule { }
