import { IsStrongPassword, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/validators/match.decorators';
import { i18nValidationMessage as i18nVM } from 'nestjs-i18n';

const $ = 'validation.changePassword';

export class ChangePasswordDto {
  @ApiProperty()
  @IsStrongPassword({}, { message: i18nVM(`${$}.password.IsStrongPassword`) })
  password: string;

  @ApiProperty()
  @Match('password', { message: i18nVM(`${$}.confirmPassword.Match`) })
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  oldPassword: string;
}
