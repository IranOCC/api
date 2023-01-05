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
import { EstateDocumentTypeService } from './documentType.service';
import { CreateEstateDocumentTypeDto } from './dto/createEstateDocumentType.dto';
import { UpdateEstateDocumentTypeDto } from './dto/updateEstateDocumentType.dto';

@Controller('estate/documentType')
export class EstateDocumentTypeController {
  constructor(
    private readonly estateDocumentTypeService: EstateDocumentTypeService,
  ) {}

  @Post()
  @Roles(RoleEnum.SuperAdmin)
  create(@Body() data: CreateEstateDocumentTypeDto) {
    return this.estateDocumentTypeService.create(data);
  }

  @Get()
  findAll() {
    return this.estateDocumentTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateDocumentTypeService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin)
  update(@Param('id') id: string, @Body() data: UpdateEstateDocumentTypeDto) {
    return this.estateDocumentTypeService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.estateDocumentTypeService.remove(id);
  }
}
