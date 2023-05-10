import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { CreateEstateFeatureDto } from './dto/createEstateFeature.dto';
import { UpdateEstateFeatureDto } from './dto/updateEstateFeature.dto';
import { EstateFeatureService } from './feature.service';

@Controller('estate/feature')
export class EstateFeatureController {
  constructor(private readonly estateFeatureService: EstateFeatureService) {}

  @Post()
  @Roles(RoleEnum.SuperAdmin)
  create(@Body() data: CreateEstateFeatureDto) {
    return this.estateFeatureService.create(data);
  }

  @Get()
  findAll() {
    return this.estateFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateFeatureService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin)
  update(@Param('id') id: string, @Body() data: UpdateEstateFeatureDto) {
    return this.estateFeatureService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.estateFeatureService.remove(id);
  }
}
