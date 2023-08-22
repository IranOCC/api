import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopulatedType, listAggregation } from 'src/utils/helper/listAggregation.helper';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { User } from 'src/user/schemas/user.schema';
import { NewIssueReportDto } from './dto/newIssueReport.dto';
import { ObjectId } from 'mongodb';
import { IssueReport, IssueReportDocument } from '../schemas/issueReport.schema';




@Injectable()
export class IssueReportPublicService {
  constructor(
    @InjectModel(IssueReport.name) private issueReportModel: Model<IssueReportDocument>,
  ) { }


  // New Issue
  create(data: NewIssueReportDto, user?: User) {
    return this.issueReportModel.create({
      relatedTo: data.relatedTo,
      relatedToID: data.relatedToID,
      content: data.content,
      createdBy: user,
    })
  }




}


