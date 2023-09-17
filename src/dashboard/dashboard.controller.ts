import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/auth/guard/jwt-auth.guard';



@Controller('admin/dashboard')
@Public()
@ApiTags('Dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  // ==================================================================================================> province autoComplete
  @Get('session')
  sessionReport() {
    return this.dashboardService.sessionReport();
  }


  @Get('estates')
  estatesReport(@Query('period') period: "daily" | "weekly" | "monthly") {
    return this.dashboardService.estatesReport(period);
  }




}
