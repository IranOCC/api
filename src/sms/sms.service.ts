import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async welcome(): Promise<any> {
    return this.httpService.get('ws.asmx?WSDL');
  }
  async verification(user: User, token: string) {
    console.log(token);
    return true;
  }
  async resetPassword(user: User, token: string) {
    console.log(token);
    return true;
  }
}
