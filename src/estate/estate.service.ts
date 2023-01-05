import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/createEstate.dto';
import { UpdateEstateDto } from './dto/updateEstate.dto';
@Injectable()
export class EstateService {
  create(data: CreateEstateDto) {
    return 'This action adds a new estate';
  }

  findAll() {
    return `This action returns all estate`;
  }

  findOne(id: string) {
    return `This action returns a #${id} estate`;
  }

  update(id: string, data: UpdateEstateDto) {
    return `This action updates a #${id} estate`;
  }

  remove(id: string) {
    return `This action removes a #${id} estate`;
  }
}
