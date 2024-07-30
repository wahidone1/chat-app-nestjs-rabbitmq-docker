// src/user/user.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../common/multer/multer.config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The data required to update a user',
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'new_password123',
        },
        photo: {
          type: 'string',
          format: 'url',
          example: 'https://example.com/photo.jpg',
        },
        name: {
          type: 'string',
          example: 'John Doe',
        },
        birthdate: {
          type: 'string',
          format: 'date',
          example: '1990-01-01',
        },
        height: {
          type: 'number',
          example: '180',
        },
        weight: {
          type: 'number',
          example: '70',
        },
        interest: {
          type: 'string',
          example: 75,
        },
      },
    },
  })
  updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.photo = file.filename;
    }
    return this.userService.update(req.user.username, updateUserDto);
  }
}
