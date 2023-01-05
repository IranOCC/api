import { Injectable } from '@nestjs/common';
import { CreateEstateFeatureDto } from './dto/createEstateFeature.dto';
import { UpdateEstateFeatureDto } from './dto/updateEstateFeature.dto';

@Injectable()
export class EstateFeatureService {
  create(data: CreateEstateFeatureDto) {
    return 'This action adds a new estate';
  }

  findAll() {
    return `This action returns all estate`;
  }

  findOne(id: string) {
    return `This action returns a #${id} estate`;
  }

  update(id: string, data: UpdateEstateFeatureDto) {
    return `This action updates a #${id} estate`;
  }

  remove(id: string) {
    return `This action removes a #${id} estate`;
  }
}
