import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  // @ApiProperty()
  // @Transform(({ value }) => value.toLowerCase())
  // username: string;

  @ApiProperty()
  password: string;
}
