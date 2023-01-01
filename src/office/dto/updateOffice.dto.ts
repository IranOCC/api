import { PartialType } from '@nestjs/swagger';
import { CreateOfficeDto } from './createOffice.dto';

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {}
