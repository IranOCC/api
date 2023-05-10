import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Estate, EstateSchema } from './estate/schemas/estate.schema';
import { EstateService } from './estate/estate.service';
import { EstateController } from './estate/estate.controller';

import { EstateDocumentType, EstateDocumentTypeSchema } from './document/schemas/estateDocumentType.schema';
import { EstateDocumentTypeController } from './document/documentType.controller';
import { EstateDocumentTypeService } from './document/documentType.service';

import { EstateCategory, EstateCategorySchema } from './category/schemas/estateCategory.schema';
import { EstateCategoryController } from './category/category.controller';
import { EstateCategoryService } from './category/category.service';

import { EstateFeature, EstateFeatureSchema } from './feature/schemas/estateFeature.schema';
import { EstateFeatureController } from './feature/feature.controller';
import { EstateFeatureService } from './feature/feature.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estate.name, schema: EstateSchema }]),
    MongooseModule.forFeature([{ name: EstateCategory.name, schema: EstateCategorySchema }]),
    MongooseModule.forFeature([{ name: EstateFeature.name, schema: EstateFeatureSchema }]),
    MongooseModule.forFeature([{ name: EstateDocumentType.name, schema: EstateDocumentTypeSchema }]),
  ],
  controllers: [
    EstateCategoryController,
    EstateFeatureController,
    EstateDocumentTypeController,
    EstateController,
  ],
  providers: [
    EstateCategoryService,
    EstateFeatureService,
    EstateDocumentTypeService,
    EstateService,
  ],
})


export class EstateModule { }
