import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IconService } from './icon.service';
import { CreateIconDto } from './dto/createIcon.dto';
import { UpdateIconDto } from './dto/updateIcon.dto';

@Controller('icon')
export class IconController {
  constructor(private readonly iconService: IconService) { }

  @Post()
  create(@Body() createIconDto: CreateIconDto) {
    return this.iconService.create(createIconDto);
  }

  @Get()
  findAll() {
    return this.iconService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iconService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIconDto: UpdateIconDto) {
    return this.iconService.update(id, updateIconDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.iconService.remove(id);
  }
}
