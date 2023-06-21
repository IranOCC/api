import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmailValueDto } from './emailAddress.dto';


export class EmailDto extends EmailValueDto {
  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;
}
