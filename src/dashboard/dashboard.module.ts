import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Ga4Module } from '@aurelle/nestjs-ga4'
import { ConfigService } from '@nestjs/config';
import { Ga4ModuleConfig } from '@aurelle/nestjs-ga4/dist/ga4/interfaces';

@Module({
  imports: [
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
