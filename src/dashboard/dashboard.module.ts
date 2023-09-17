import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Estate, EstateSchema } from 'src/estate/estate/schemas/estate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estate.name, schema: EstateSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
