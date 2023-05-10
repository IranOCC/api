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
import { RoleEnum } from 'src/user/enum/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@Controller('estate')
export class EstateController {
  constructor(private readonly estateService: EstateService) { }

  @Get('statics/:subject')
  @Roles(RoleEnum.Admin)
  statics(@Param('subject') subject: string) {
    return this.estateService.statics(subject);
  }



  // === estate

  @Post()
  create(@Body() data: CreateEstateDto) {
    return this.estateService.create(data);
  }

  @Get()
  findAll() {
    return this.estateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateEstateDto) {
    return this.estateService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estateService.remove(id);
  }
}
