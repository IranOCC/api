import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueReport, IssueReportSchema } from './schemas/issueReport.schema';
import { IssueReportPublicController } from './public/issueReport.public.controller';
import { IssueReportPublicService } from './public/issueReport.public.service';




@Module({
  exports: [
  ],
  imports: [
    MongooseModule.forFeature([{ name: IssueReport.name, schema: IssueReportSchema }]),
  ],
  controllers: [
    IssueReportPublicController,
  ],
  providers: [
    IssueReportPublicService
  ],
})
export class IssueReportModule { }
