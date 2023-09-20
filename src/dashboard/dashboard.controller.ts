import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { RangeDateEnum } from './enum/RangeDate.enum';
import { VisitorsReportEnum } from './enum/VisitorsReport.enum';
import { PeriodTypeEnum } from './enum/PeriodType.enum';
import { ChartModeEnum } from './enum/ChartMode.enum';



@Controller('admin/dashboard')
@Public()
@ApiTags('Dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  // ==================================================================================================> province autoComplete
  @Get('visitors/:report')
  @ApiParam({ name: "report", enum: VisitorsReportEnum })
  @ApiQuery({ name: "range", enum: RangeDateEnum })
  visitorsReport(@Param('report') report: VisitorsReportEnum, @Query('range') range: RangeDateEnum) {
    return this.dashboardService.visitorsReport(report, range);
  }


  @Get('estates')
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  estatesReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.estatesReport(period);
  }

  @Get('posts')
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  postsReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.postsReport(period);
  }



  @Get('officeEstatesCountSeries')
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  officeEstatesCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.officeEstatesCountSeriesReport(mode);
  }

  @Get('officeEstatesTimeSeries')
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  officeEstatesTimeSeriesReport(@Query('period') period?: PeriodTypeEnum) {
    return this.dashboardService.officeEstatesTimeSeriesReport(period);
  }

  @Get('officePostsCountSeries')
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  officePostsCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.officePostsCountSeriesReport(mode);
  }

  @Get('officePostsTimeSeries')
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  officePostsTimeSeriesReport(@Query('period') period?: PeriodTypeEnum) {
    return this.dashboardService.officePostsTimeSeriesReport(period);
  }




  @Get('userEstatesCountSeries')
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  userEstatesCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.userEstatesCountSeriesReport(mode);
  }

  @Get('userEstatesTimeSeries')
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  userEstatesTimeSeriesReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.userEstatesTimeSeriesReport(period);
  }

  @Get('userPostsCountSeries')
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  userPostsCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.userPostsCountSeriesReport(mode);
  }

  @Get('userPostsTimeSeries')
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  userPostsTimeSeriesReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.userPostsTimeSeriesReport(period);
  }

}
