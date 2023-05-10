import { PartialType } from '@nestjs/swagger';
import { CreateEstateCategoryDto } from './createEstateCategory.dto';

export class UpdateEstateCategoryDto extends PartialType(
  CreateEstateCategoryDto,
) {}
