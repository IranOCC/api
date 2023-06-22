import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserService } from '../user.service';

@Controller('user')
@Public()
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerPublic {
  constructor(private readonly userService: UserService) { }


}
