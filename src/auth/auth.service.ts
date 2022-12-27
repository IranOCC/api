import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = {
      username: 'hello',
      password: 'mmm',
      firstName: 'Abbas',
      roles: ['Admin'],
    };
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
