import { Injectable } from '@nestjs/common';
import { CreateEstateCategoryDto } from './dto/createEstateCategory.dto';
import { UpdateEstateCategoryDto } from './dto/updateEstateCategory.dto';

@Injectable()
export class EstateCategoryService {
  create(data: CreateEstateCategoryDto) {
    return 'This action adds a new estate';
  }

  findAll() {
    return `This action returns all estate`;
  }

  findOne(id: string) {
    return `This action returns a #${id} estate`;
  }

  update(id: string, data: UpdateEstateCategoryDto) {
    return `This action updates a #${id} estate`;
  }

  remove(id: string) {
    return `This action removes a #${id} estate`;
  }
}
