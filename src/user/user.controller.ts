import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from './enum/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY0MDM1MDVmZmQ5OTA1ODI3M2FkZjQiLCJmaXJzdE5hbWUiOiLYsdiz2YjZhCIsImxhc3ROYW1lIjoi2KfYrdmF2K_bjCDZgdixIiwidmVyaWZpZWQiOnRydWUsImFjdGl2ZSI6dHJ1ZSwicm9sZXMiOlsiU3VwZXJBZG1pbiIsIkFkbWluIiwiQXV0aG9yIiwiQWdlbnQiLCJVc2VyIl0sImFjY291bnRUb2tlbiI6IkhGNUhPTFo2R1JXWFNKU0oiLCJwaG9uZSI6eyJfaWQiOiI2NDY0MDM1MDVmZmQ5OTA1ODI3M2FkZjYiLCJ2YWx1ZSI6Iis5ODkyMTI3MjgzMDciLCJ2ZXJpZmllZCI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAyMy0wNS0xNlQyMjoyNzoyOC4yMzlaIiwidXBkYXRlZEF0IjoiMjAyMy0wNS0xN1QxMTowOTo1MS45MTNaIiwiX192IjowfSwiZW1haWwiOnsiX2lkIjoiNjQ2NDAzNTA1ZmZkOTkwNTgyNzNhZGY5IiwidmFsdWUiOiJyLmFobWFkaWZhci4xMzc3QGdtYWlsLmNvbSIsInZlcmlmaWVkIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTE2VDIyOjI3OjI4LjU4MloiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTE3VDExOjA5OjUyLjM0N1oiLCJfX3YiOjB9LCJsb2NhdGlvbiI6IjM1LjczMDA3MDU2NDg4Mzk1LDUxLjQ5MzQzNDkwNjAwNTg3IiwiZnVsbE5hbWUiOiLYsdiz2YjZhCDYp9it2YXYr9uMINmB2LEiLCJpZCI6IjY0NjQwMzUwNWZmZDk5MDU4MjczYWRmNCIsImlhdCI6MTY4NzM2Nzk2NiwiZXhwIjoxNjg5OTU5OTY2fQ.kdmBV2GQOk2IBT1ovMsXNcFw6oB_fW38hqRpSy7RvNs

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@Public()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('assignList')
  // @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('search') search: string) {
    return this.userService.assignList(search);
  }


  @Get('statics/:subject')
  // @Roles(RoleEnum.Admin)
  statics(@Param('subject') subject: string) {
    return this.userService.statics(subject);
  }


  @Post()
  // @Roles(RoleEnum.Admin)
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  // @Roles(RoleEnum.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  // @Roles(RoleEnum.Admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  // @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  // @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
