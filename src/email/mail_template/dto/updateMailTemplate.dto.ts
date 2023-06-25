import { PartialType } from '@nestjs/swagger';
import { CreateMailTemplateDto } from './createMailTemplate.dto';

export class UpdateMailTemplateDto extends PartialType(CreateMailTemplateDto)
{ }
