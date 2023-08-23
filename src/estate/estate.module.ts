import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';




import { EstateCategory, EstateCategorySchema } from './category/schemas/estateCategory.schema';
import { EstateCategoryAdminController } from './category/admin/category.admin.controller';
import { EstateCategoryToolsController } from './category/tools/category.tools.controller';
import { EstateCategoryAdminService } from './category/admin/category.admin.service';
import { EstateCategoryToolsService } from './category/tools/category.tools.service';


import { EstateDocumentType, EstateDocumentTypeSchema } from './documentType/schemas/estateDocumentType.schema';
import { EstateDocumentTypeAdminController } from './documentType/admin/documentType.admin.controller';
import { EstateDocumentTypeToolsController } from './documentType/tools/documentType.tools.controller';
import { EstateDocumentTypeAdminService } from './documentType/admin/documentType.admin.service';
import { EstateDocumentTypeToolsService } from './documentType/tools/documentType.tools.service';


import { EstateFeature, EstateFeatureSchema } from './feature/schemas/estateFeature.schema';
import { EstateFeatureAdminController } from './feature/admin/feature.admin.controller';
import { EstateFeatureToolsController } from './feature/tools/feature.tools.controller';
import { EstateFeatureAdminService } from './feature/admin/feature.admin.service';
import { EstateFeatureToolsService } from './feature/tools/feature.tools.service';


import { EstateType, EstateTypeSchema } from './type/schemas/estateType.schema';
import { EstateTypeAdminController } from './type/admin/type.admin.controller';
import { EstateTypeAdminService } from './type/admin/type.admin.service';
import { EstateTypeToolsController } from './type/tools/type.tools.controller';
import { EstateTypeToolsService } from './type/tools/type.tools.service';
import { EstateFavorite, EstateFavoriteSchema } from './favorite/schemas/estateFavorite.schema';


import { Estate, EstateSchema } from './estate/schemas/estate.schema';
import { EstateAdminController } from './estate/admin/estate.admin.controller';
import { EstateAdminService } from './estate/admin/estate.admin.service';
import { EstateToolsController } from './estate/tools/estate.tools.controller';
import { EstateToolsService } from './estate/tools/estate.tools.service';
import { EstateFavoritePublicController } from './favorite/public/estateFavorite.public.controller';
import { EstateFavoritePublicService } from './favorite/public/estateFavorite.public.service';
import { EstatePublicController } from './estate/public/estate.public.controller';
import { EstatePublicService } from './estate/public/estate.public.service';
import { OfficeModule } from 'src/office/office.module';




@Module({
  exports: [EstateAdminService],
  imports: [
    OfficeModule,
    MongooseModule.forFeature([{ name: Estate.name, schema: EstateSchema }]),
    MongooseModule.forFeature([{ name: EstateCategory.name, schema: EstateCategorySchema }]),
    MongooseModule.forFeature([{ name: EstateFeature.name, schema: EstateFeatureSchema }]),
    MongooseModule.forFeature([{ name: EstateDocumentType.name, schema: EstateDocumentTypeSchema }]),
    MongooseModule.forFeature([{ name: EstateType.name, schema: EstateTypeSchema }]),
    MongooseModule.forFeature([{ name: EstateFavorite.name, schema: EstateFavoriteSchema }]),
  ],
  controllers: [
    EstateTypeAdminController,
    EstateTypeToolsController,


    EstateCategoryAdminController,
    EstateCategoryToolsController,

    EstateFeatureAdminController,
    EstateFeatureToolsController,

    EstateDocumentTypeAdminController,
    EstateDocumentTypeToolsController,

    EstateFavoritePublicController,

    EstateAdminController,
    EstateToolsController,
    EstatePublicController,
  ],
  providers: [
    EstateTypeAdminService,
    EstateTypeToolsService,


    EstateCategoryAdminService,
    EstateCategoryToolsService,

    EstateFeatureAdminService,
    EstateFeatureToolsService,

    EstateDocumentTypeAdminService,
    EstateDocumentTypeToolsService,

    EstateFavoritePublicService,

    EstateAdminService,
    EstateToolsService,
    EstatePublicService,
  ],
})


export class EstateModule { }
