import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/createEstate.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';

@Injectable()
export class EstateService {
  create(createEstateDto: CreateEstateDto) {
    return 'This action adds a new estate';
  }

  findAll() {
    return `This action returns all estate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estate`;
  }

  update(id: number, updateEstateDto: UpdateEstateDto) {
    return `This action updates a #${id} estate`;
  }

  remove(id: number) {
    return `This action removes a #${id} estate`;
  }
}
