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
import { CreateEstateTypeDto } from './dto/createEstateType.dto';
import { UpdateEstateTypeDto } from './dto/updateEstateType.dto';
import { EstateTypeService } from './type.service';

@Controller('estate/type')
export class EstateTypeController {
  constructor(private readonly estateTypeService: EstateTypeService) { }

  // ==
  @Get('assignList')
  @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('cat') cat: string[], @Query('search') search: string,) {
    return this.estateTypeService.assignList(cat, search);
  }
  // ==


  @Post()
  @Roles(RoleEnum.SuperAdmin)
  create(@Body() data: CreateEstateTypeDto) {
    return this.estateTypeService.create(data);
  }

  @Get()
  findAll() {
    return this.estateTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateTypeService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin)
  update(@Param('id') id: string, @Body() data: UpdateEstateTypeDto) {
    return this.estateTypeService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.estateTypeService.remove(id);
  }
}
