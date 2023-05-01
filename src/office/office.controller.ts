import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/createOffice.dto';
import { UpdateOfficeDto } from './dto/updateOffice.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/user/enum/role.enum';

@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) { }

  @Post()
  @Roles(RoleEnum.Admin)
  create(@Body() data: CreateOfficeDto) {
    return this.officeService.create(data);
  }

  @Get()
  @Roles(RoleEnum.Admin)
  findAll() {
    return this.officeService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.Admin)
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() data: UpdateOfficeDto) {
    return this.officeService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.officeService.remove(id);
  }
}
