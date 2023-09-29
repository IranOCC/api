import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { RangeDateEnum } from './enum/RangeDate.enum';
import { VisitorsReportEnum } from './enum/VisitorsReport.enum';
import { PeriodTypeEnum } from './enum/PeriodType.enum';
import { ChartModeEnum } from './enum/ChartMode.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { TimeFrameEnum } from './enum/TimeFrame.enum';



@Controller('admin/dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  // ==================================================================================================> province autoComplete
  @Get('myStatistics')
  @Roles(RoleEnum.User)
  myStatistics(@Request() { user }) {
    return this.dashboardService.myStatistics(user);
  }

  // ==================================================================================================> province autoComplete
  @Get('firstSight')
  @Roles(RoleEnum.SuperAdmin)
  firstSight() {
    return this.dashboardService.firstSight();
  }




  // ==================================================================================================> province autoComplete
  @Get('visitors/realtime')
  // @Roles(RoleEnum.SuperAdmin)
  @Public()
  visitorsRealtime() {
    return this.dashboardService.visitorsRealtime();
  }

  // ==================================================================================================> province autoComplete
  @Get('visitors/:report')
  @Roles(RoleEnum.SuperAdmin)
  @ApiParam({ name: "report", enum: VisitorsReportEnum })
  @ApiQuery({ name: "timeFrame", enum: TimeFrameEnum })
  @ApiQuery({ name: "range", enum: RangeDateEnum })
  visitorsReport(@Param('report') report: VisitorsReportEnum, @Query('range') range: RangeDateEnum, @Query('timeFrame') timeFrame: TimeFrameEnum) {
    return this.dashboardService.visitorsReport(report, range, timeFrame);
  }



  @Get('estates')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  estatesReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.estatesReport(period);
  }

  @Get('posts')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  postsReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.postsReport(period);
  }



  @Get('officeEstatesCountSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  officeEstatesCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.officeEstatesCountSeriesReport(mode);
  }

  @Get('officeEstatesTimeSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  officeEstatesTimeSeriesReport(@Query('period') period?: PeriodTypeEnum) {
    return this.dashboardService.officeEstatesTimeSeriesReport(period);
  }

  @Get('officePostsCountSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  officePostsCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.officePostsCountSeriesReport(mode);
  }

  @Get('officePostsTimeSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  officePostsTimeSeriesReport(@Query('period') period?: PeriodTypeEnum) {
    return this.dashboardService.officePostsTimeSeriesReport(period);
  }




  @Get('userEstatesCountSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  userEstatesCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.userEstatesCountSeriesReport(mode);
  }

  @Get('userEstatesTimeSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  userEstatesTimeSeriesReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.userEstatesTimeSeriesReport(period);
  }

  @Get('userPostsCountSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "mode", enum: ChartModeEnum })
  userPostsCountSeriesReport(@Query('mode') mode: ChartModeEnum) {
    return this.dashboardService.userPostsCountSeriesReport(mode);
  }

  @Get('userPostsTimeSeries')
  @Roles(RoleEnum.SuperAdmin)
  @ApiQuery({ name: "period", enum: PeriodTypeEnum })
  userPostsTimeSeriesReport(@Query('period') period: PeriodTypeEnum) {
    return this.dashboardService.userPostsTimeSeriesReport(period);
  }

}
