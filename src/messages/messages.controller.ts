import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Message } from './schemas/message.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async sendMessage(
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    console.log(req.user);
    console.log(req.user);
    return this.messagesService.sendMessage(
      req.user.username,
      createMessageDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  @ApiOperation({ summary: 'Get messages between two users' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully.',
    type: [Message],
  })
  @ApiBody({
    description: 'Create a new message',
    schema: {
      type: 'object',
      properties: {
        sender: {
          type: 'string',
          example: 'John Doe',
        },
        receiver: {
          type: 'string',
          example: 'Erick',
        },
        text: {
          type: 'string',
          example: 'Hello, World!',
        },
      },
    },
  })
  async findAll(
    @Param('username') username: string,
    @Request() req,
  ): Promise<Message[]> {
    return this.messagesService.findAll(req.user.username, username);
  }

  @EventPattern('message_received')
  async handleMessage(@Payload() message: CreateMessageDto) {
    console.log('Message received:', message);
    await this.messagesService.saveReceivedMessage(message);
    await this.messagesService.sendNotification(message);
  }
}
