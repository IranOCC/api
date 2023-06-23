import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';
import { UserServicePublic } from '../services/user.public.service';

@Controller('user')
@Public()
@ApiTags('User')
@ApiBearerAuth()
export class UserControllerPublic {
  constructor(private readonly userServicePublic: UserServicePublic) { }


}
