import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Office } from '../office/schemas/office.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async welcome(): Promise<any> {
    return this.httpService.get('ws.asmx?WSDL');
  }
  async verification(owner: User | Office, token: string) {
    console.log(token);
    return true;
  }
  async resetPassword(owner: User | Office, token: string) {
    console.log(token);
    return true;
  }
}
