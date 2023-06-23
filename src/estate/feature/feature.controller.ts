import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/auth/guard/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { CreateEstateFeatureDto } from './dto/createEstateFeature.dto';
import { UpdateEstateFeatureDto } from './dto/updateEstateFeature.dto';
import { EstateFeatureService } from './feature.service';

@Controller('estate/feature')
export class EstateFeatureController {
  constructor(private readonly estateFeatureService: EstateFeatureService) { }

  // ==
  @Get('assignList')
  @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('cat') cat: string[], @Query('search') search: string,) {
    return this.estateFeatureService.assignList(cat, search);
  }
  // ==


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
