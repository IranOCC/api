import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from './enum/role.enum';
import { RegistrationDto } from './dto/registration.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('registration')
  registration(@Request() { user }, @Body() data: RegistrationDto) {
    return this.userService.registration(user, data);
  }





  @Post('changePassword')
  async changePassword(@Request() { user }, @Body() data: ChangePasswordDto) {
    return this.userService.passwordChange(user, data);
  }


  @Get()
  @Roles(RoleEnum.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.Admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
