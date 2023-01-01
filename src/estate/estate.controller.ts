import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EstateService } from './estate.service';
import { CreateEstateDto } from './dto/createEstate.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';

@Controller('estate')
export class EstateController {
  constructor(private readonly estateService: EstateService) {}

  @Post()
  create(@Body() createEstateDto: CreateEstateDto) {
    return this.estateService.create(createEstateDto);
  }

  @Get()
  findAll() {
    return this.estateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstateDto: UpdateEstateDto) {
    return this.estateService.update(+id, updateEstateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estateService.remove(+id);
  }
}
