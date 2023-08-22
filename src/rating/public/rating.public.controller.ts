import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guard/jwt-auth.guard';
import { RatingPublicService } from './rating.public.service';
import { NewRatingDto } from './dto/newRating.dto';




@Public()
@Controller('rating')
@ApiTags("Rating")
@ApiBearerAuth()
export class RatingPublicController {
  constructor(private readonly ratingPublicService: RatingPublicService) { }


  @Post()
  @ApiOperation({ summary: "Add New issue report", description: "No Description" })
  @ApiResponse({ status: 200 })
  create(@Body() data: NewRatingDto, @Request() { user }) {
    return this.ratingPublicService.create(data, user);
  }


}
