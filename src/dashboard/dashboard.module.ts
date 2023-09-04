import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Ga4Module } from '@aurelle/nestjs-ga4'
import { ConfigService } from '@nestjs/config';
import { Ga4ModuleConfig } from '@aurelle/nestjs-ga4/dist/ga4/interfaces';

@Module({
  imports: [
    Ga4Module.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<Ga4ModuleConfig> => {
        return {
          pathToCredentials: "src/report/key/iranocc-be83a042a97d.json",
          // disableCaching: true,
          defaultPropertyId: "405205490",
          // enableDynamicCachingLogs: true,
        }
      }
    })
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
