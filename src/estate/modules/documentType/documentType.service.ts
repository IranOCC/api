import { Injectable } from '@nestjs/common';
import { CreateEstateDocumentTypeDto } from './dto/createEstateDocumentType.dto';
import { UpdateEstateDocumentTypeDto } from './dto/updateEstateDocumentType.dto';

@Injectable()
export class EstateDocumentTypeService {
  create(data: CreateEstateDocumentTypeDto) {
    return 'This action adds a new estate';
  }

  findAll() {
    return `This action returns all estate`;
  }

  findOne(id: string) {
    return `This action returns a #${id} estate`;
  }

  update(id: string, data: UpdateEstateDocumentTypeDto) {
    return `This action updates a #${id} estate`;
  }

  remove(id: string) {
    return `This action removes a #${id} estate`;
  }
}
