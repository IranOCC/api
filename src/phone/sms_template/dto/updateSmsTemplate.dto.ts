import { PartialType } from '@nestjs/swagger';
import { CreateSmsTemplateDto } from './createSmsTemplate.dto';

export class UpdateSmsTemplateDto extends PartialType(CreateSmsTemplateDto)
{ }
