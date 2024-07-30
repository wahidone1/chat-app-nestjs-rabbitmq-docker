import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Param,
  Delete,
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
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('sendMessages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
  })
  @ApiBody({
    description: 'Details of the message to send.',
    type: CreateMessageDto,
    examples: {
      example1: {
        summary: 'Example of sending a message',
        value: {
          sender: 'user123', // Nama pengguna yang login (harus diisi otomatis)
          receiver: 'recipient456', // Nama pengguna yang akan menerima pesan
          content: 'Hello, how are you?', // Isi pesan yang dikirim
        },
      },
    },
  })
  async sendMessage(
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<void> {
    console.log(req.user);
    return this.messagesService.sendMessage(
      req.user.username,
      createMessageDto,
    );
  }

  @Get('viewMessages/:username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get messages between two users' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully.',
    type: [Message],
  })
  @ApiResponse({
    status: 404,
    description: 'Messages not found.',
  })
  @ApiParam({
    name: 'username',
    description: 'The username of the second user to retrieve messages from.',
    type: String,
  })
  async findAll(
    @Param('username') username: string,
    @Request() req,
  ): Promise<Message[]> {
    return this.messagesService.findAll(req.user.username, username);
  }

  @Delete('deleteMessagesRoom/:username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete all messages for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'All messages for the specified user deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async deleteAllMessagesByUser(
    @Param('username') username: string,
  ): Promise<void> {
    return this.messagesService.deleteAllMessagesByUser(username);
  }

  @Delete('deleteMessages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a specific message by ID' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found.',
  })
  async deleteMessageById(@Param('id') id: string): Promise<void> {
    return this.messagesService.deleteMessageById(id);
  }

  @EventPattern('message_received')
  @ApiOperation({ summary: 'Handle received message' })
  @ApiResponse({
    status: 200,
    description: 'Message received and processed successfully.',
  })
  async handleMessage(@Payload() message: CreateMessageDto) {
    console.log('Message received:', message);
    await this.messagesService.saveReceivedMessage(message);
    await this.messagesService.sendNotification(message);
  }
}
