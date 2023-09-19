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



  @Get('officeEstatesCountSeries')
  officeEstatesCountSeriesReport(@Query('mode') mode?: "barchart" | "piechart" | "table") {
    return this.dashboardService.officeEstatesCountSeriesReport(mode);
  }

  @Get('officeEstatesTimeSeries')
  officeEstatesTimeSeriesReport(@Query('period') period?: "daily" | "weekly" | "monthly") {
    return this.dashboardService.officeEstatesTimeSeriesReport(period);
  }

  @Get('officePostsCountSeries')
  officePostsCountSeriesReport(@Query('mode') mode?: "barchart" | "piechart" | "table") {
    return this.dashboardService.officePostsCountSeriesReport(mode);
  }

  @Get('officePostsTimeSeries')
  officePostsTimeSeriesReport(@Query('period') period?: "daily" | "weekly" | "monthly") {
    return this.dashboardService.officePostsTimeSeriesReport(period);
  }




  @Get('userEstatesCountSeries')
  userEstatesCountSeriesReport(@Query('mode') mode?: "barchart" | "piechart" | "table") {
    return this.dashboardService.userEstatesCountSeriesReport(mode);
  }

  @Get('userEstatesTimeSeries')
  userEstatesTimeSeriesReport(@Query('period') period?: "daily" | "weekly" | "monthly") {
    return this.dashboardService.userEstatesTimeSeriesReport(period);
  }

  @Get('userPostsCountSeries')
  userPostsCountSeriesReport(@Query('mode') mode?: "barchart" | "piechart" | "table") {
    return this.dashboardService.userPostsCountSeriesReport(mode);
  }

  @Get('userPostsTimeSeries')
  userPostsTimeSeriesReport(@Query('period') period?: "daily" | "weekly" | "monthly") {
    return this.dashboardService.userPostsTimeSeriesReport(period);
  }

}
