import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  home(): string {
    return 'IranOcc API V1.0';
  }
}
