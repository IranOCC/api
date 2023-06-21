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
import { ApiTags } from '@nestjs/swagger';



@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('assignList')
  @Roles(RoleEnum.SuperAdmin)
  assignList(@Query('search') search: string) {
    return this.userService.assignList(search);
  }


  @Get('statics/:subject')
  @Roles(RoleEnum.Admin)
  statics(@Param('subject') subject: string) {
    return this.userService.statics(subject);
  }


  @Post()
  @Roles(RoleEnum.Admin)
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
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
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
