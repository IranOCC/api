import { Module } from '@nestjs/common';
import { IconService } from './icon.service';
import { IconController } from './icon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Icon, IconSchema } from './schemas/icon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Icon.name, schema: IconSchema }]),
  ],
  controllers: [IconController],
  providers: [IconService]
})
export class IconModule { }
