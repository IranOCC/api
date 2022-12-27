import { Role } from './role.enum';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  roles: Role[];
}
