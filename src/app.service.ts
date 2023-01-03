import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  homeAPI(): string {
    return 'IRANOCC-api.v1.0';
  }
}
