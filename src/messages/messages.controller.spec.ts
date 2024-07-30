import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  const mockMessagesService = {
    sendMessage: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    saveReceivedMessage: jest.fn().mockResolvedValue(undefined),
    sendNotification: jest.fn().mockResolvedValue(undefined),
  };

  const mockRequest = {
    user: { username: 'testuser' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: (context: ExecutionContext) => true,
          },
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should call MessagesService.sendMessage with correct parameters', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiveruser',
        content: 'Hello!',
        sender: '',
      };

      await controller.sendMessage(mockRequest as any, createMessageDto);

      expect(service.sendMessage).toHaveBeenCalledWith(
        'testuser',
        createMessageDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call MessagesService.findAll and return messages', async () => {
      const result = await controller.findAll(
        'anotheruser',
        mockRequest as any,
      );

      expect(service.findAll).toHaveBeenCalledWith('testuser', 'anotheruser');
      expect(result).toEqual([]);
    });
  });

  describe('handleMessage', () => {
    it('should handle message received event', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiveruser',
        content: 'Hello!',
      };

      await controller.handleMessage(createMessageDto);

      expect(service.saveReceivedMessage).toHaveBeenCalledWith(
        createMessageDto,
      );
      expect(service.sendNotification).toHaveBeenCalledWith(createMessageDto);
    });
  });
});
