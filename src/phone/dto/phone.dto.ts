import { IsOptional, } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PhoneValueDto } from './phoneNumber.dto';


// admin for users & office
export class PhoneDto extends PhoneValueDto {
  @ApiPropertyOptional()
  @IsOptional()
  verified: boolean;
}
