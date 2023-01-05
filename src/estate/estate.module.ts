import { Module } from '@nestjs/common';
import { EstateService } from './estate.service';
import { EstateController } from './estate.controller';
import { EstateDocumentTypeController } from './modules/documentType/documentType.controller';
import { EstateDocumentTypeService } from './modules/documentType/documentType.service';
import { EstateCategoryController } from './modules/category/category.controller';
import { EstateCategoryService } from './modules/category/category.service';
import { EstateFeatureController } from './modules/feature/feature.controller';
import { EstateFeatureService } from './modules/feature/feature.service';

@Module({
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
