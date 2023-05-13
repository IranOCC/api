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
import { EstateDocumentTypeService } from './documentType.service';
import { CreateEstateDocumentTypeDto } from './dto/createEstateDocumentType.dto';
import { UpdateEstateDocumentTypeDto } from './dto/updateEstateDocumentType.dto';

@Controller('estate/document')
export class EstateDocumentTypeController {
  constructor(
    private readonly estateDocumentTypeService: EstateDocumentTypeService,
  ) { }

  // ==
  @Get('assignList')
  @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('cat') cat: string[], @Query('search') search: string,) {
    return this.estateDocumentTypeService.assignList(cat, search);
  }
  // ==

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
