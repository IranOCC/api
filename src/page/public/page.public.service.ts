import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Page, PageDocument } from '../schemas/page.schema';
import { PageStatusEum } from '../enum/pageStatus.enum';




@Injectable()
export class PagePublicService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
  ) { }


  // Get Page
  findOneBySlugOrID(id_or_slug: string) {
    let query = ObjectId.isValid(id_or_slug) ? { _id: new ObjectId(id_or_slug) } : { slug: id_or_slug }
    query["status"] = PageStatusEum.Publish
    query["publishedAt"] = { $lte: Date.now() }

    return this.pageModel.findOne(query)
      .select("-status -id -createdBy -createdAt -updatedAt -__v")
      .exec();
  }


}


