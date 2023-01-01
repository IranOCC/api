import { PartialType } from '@nestjs/swagger';
import { CreateEstateDto } from './createEstate.dto';

export class UpdateEstateDto extends PartialType(CreateEstateDto) {}
