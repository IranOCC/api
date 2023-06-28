import { PartialType } from '@nestjs/swagger';
import { CreateStorageDto } from './createStorage.dto';

export class UpdateStorageDto extends PartialType(CreateStorageDto) { }
