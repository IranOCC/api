import { Module } from '@nestjs/common';
import { EstateService } from './estate.service';
import { EstateController } from './estate.controller';
import { EstateDocumentTypeController } from './modules/documentType/documentType.controller';
import { EstateDocumentTypeService } from './modules/documentType/documentType.service';
import { EstateCategoryController } from './modules/category/category.controller';
import { EstateCategoryService } from './modules/category/category.service';
import { EstateFeatureController } from './modules/feature/feature.controller';
import { EstateFeatureService } from './modules/feature/feature.service';
import { Estate, EstateSchema } from './schemas/estate.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EstateCategory,
  EstateCategorySchema,
} from './modules/category/schemas/estateCategory.schema';
import {
  EstateFeature,
  EstateFeatureSchema,
} from './modules/feature/schemas/estateFeature.schema';
import {
  EstateDocumentType,
  EstateDocumentTypeSchema,
} from './modules/documentType/schemas/estateDocumentType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Estate.name, schema: EstateSchema }]),
    MongooseModule.forFeature([
      { name: EstateCategory.name, schema: EstateCategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: EstateFeature.name, schema: EstateFeatureSchema },
    ]),
    MongooseModule.forFeature([
      { name: EstateDocumentType.name, schema: EstateDocumentTypeSchema },
    ]),
  ],
  controllers: [
    EstateController,
    EstateCategoryController,
    EstateFeatureController,
    EstateDocumentTypeController,
  ],
  providers: [
    EstateService,
    EstateCategoryService,
    EstateFeatureService,
    EstateDocumentTypeService,
  ],
})
export class EstateModule {}
