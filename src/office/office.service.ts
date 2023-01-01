import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/createOffice.dto';
import { UpdateOfficeDto } from './dto/updateOffice.dto';

@Injectable()
export class OfficeService {
  create(createOfficeDto: CreateOfficeDto) {
    return 'This action adds a new office';
  }

  findAll() {
    return `This action returns all office`;
  }

  findOne(id: number) {
    return `This action returns a #${id} office`;
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return `This action updates a #${id} office`;
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }
}
