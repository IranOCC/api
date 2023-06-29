import { PartialType } from '@nestjs/swagger';
import { CreateEstateFeatureDto } from './createEstateFeature.dto';

export class UpdateEstateFeatureDto extends PartialType(
  CreateEstateFeatureDto,
) {}
