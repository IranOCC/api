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
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @Roles(RoleEnum.SuperAdmin)
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officeService.create(createOfficeDto);
  }

  @Get()
  @Roles(RoleEnum.SuperAdmin)
  findAll() {
    return this.officeService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.SuperAdmin)
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officeService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.officeService.remove(id);
  }
}
