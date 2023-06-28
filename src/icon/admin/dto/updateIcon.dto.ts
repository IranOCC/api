import { PartialType } from '@nestjs/swagger';
import { CreateIconDto } from './createIcon.dto';

export class UpdateIconDto extends PartialType(CreateIconDto) { }
