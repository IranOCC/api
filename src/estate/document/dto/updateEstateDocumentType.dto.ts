import { PartialType } from '@nestjs/swagger';
import { CreateEstateDocumentTypeDto } from './createEstateDocumentType.dto';

export class UpdateEstateDocumentTypeDto extends PartialType(
  CreateEstateDocumentTypeDto,
) {}
