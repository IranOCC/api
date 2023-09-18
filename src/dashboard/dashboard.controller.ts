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

  @Get('posts')
  postsReport(@Query('period') period: "daily" | "weekly" | "monthly") {
    return this.dashboardService.postsReport(period);
  }



  @Get('officeEstates')
  officeEstatesReport(@Query('type') type: "count" | "time", @Query('period') period?: "daily" | "weekly" | "monthly", @Query('mode') mode?: "barchart" | "piechart" | "table") {
    return this.dashboardService.officeEstatesReport(type, period, mode);
  }

  @Get('officePosts')
  officePostsReport(@Query('type') type: "count" | "time", @Query('period') period?: "daily" | "weekly" | "monthly", @Query('mode') mode?: "barchart" | "piechart" | "table") {
    return this.dashboardService.officePostsReport(type, period, mode);
  }

  
}
