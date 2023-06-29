import { PartialType } from '@nestjs/swagger';
import { CreateEstateTypeDto } from './createEstateType.dto';

export class UpdateEstateTypeDto extends PartialType(
  CreateEstateTypeDto,
) { }
