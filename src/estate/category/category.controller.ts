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
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';
import { EstateCategoryService } from './category.service';
import { CreateEstateCategoryDto } from './dto/createEstateCategory.dto';
import { UpdateEstateCategoryDto } from './dto/updateEstateCategory.dto';

@Controller('estate/category')
export class EstateCategoryController {
  constructor(private readonly estateCategoryService: EstateCategoryService) { }

  @Get('parentList')
  @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('search') search: string) {
    return this.estateCategoryService.parentList(search);
  }

  @Post()
  @Roles(RoleEnum.SuperAdmin)
  create(@Body() data: CreateEstateCategoryDto) {
    return this.estateCategoryService.create(data);
  }

  @Get()
  findAll() {
    return this.estateCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateCategoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin)
  update(@Param('id') id: string, @Body() data: UpdateEstateCategoryDto) {
    return this.estateCategoryService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.estateCategoryService.remove(id);
  }
}
