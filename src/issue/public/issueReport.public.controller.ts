import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { IssueReportPublicService } from './issueReport.public.service';
import { NewIssueReportDto } from './dto/newIssueReport.dto';
import { MongoIDQueryDto } from 'src/utils/dto/mongoIDQuery.dto';




@Public()
@Controller('issue/report')
@ApiTags("IssueReport")
@ApiBearerAuth()
export class IssueReportPublicController {
  constructor(private readonly issueReportPublicService: IssueReportPublicService) { }


  @ApiOperation({ summary: "Add New issue report", description: "No Description" })
  @ApiResponse({ status: 200 })
  create(@Body() data: NewIssueReportDto, @Request() { user }) {
    return this.issueReportPublicService.create(data, user);
  }


}
