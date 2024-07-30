import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { NotificationService } from '../notification/notification.service';
import { BadRequestException } from '@nestjs/common';

describe('MessagesService', () => {
  let service: MessagesService;
  let model: Model<MessageDocument>;
  let notificationService: NotificationService;

  const mockMessageModel = {
    new: jest.fn().mockResolvedValue(mockMessage),
    constructor: jest.fn().mockResolvedValue(mockMessage),
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockMessage]),
    save: jest.fn().mockResolvedValue(mockMessage),
    findOne: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
  };

  const mockNotificationService = {
    sendNotification: jest.fn(),
  };

  const mockMessage = {
    sender: 'sender_user',
    receiver: 'receiver_user',
    content: 'Hello!',
    date: new Date(),
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    model = module.get<Model<MessageDocument>>(getModelToken(Message.name));
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should save a message and send a notification', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiver_user',
        content: 'Hello!',
      };

      jest.spyOn(model, 'save').mockResolvedValue(mockMessage as any);
      jest
        .spyOn(notificationService, 'sendNotification')
        .mockResolvedValue(undefined);

      await service.sendMessage('sender_user', createMessageDto);

      expect(model.save).toHaveBeenCalled();
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        'receiver_user',
        'Anda memiliki pesan baru',
      );
    });

    it('should throw an error if message saving fails', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiver_user',
        content: 'Hello!',
      };

      jest.spyOn(model, 'save').mockRejectedValue(new Error('Save failed'));

      await expect(
        service.sendMessage('sender_user', createMessageDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return messages between two users', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockMessage] as any);

      const result = await service.findAll('user1', 'user2');
      expect(result).toEqual([mockMessage]);
    });

    it('should throw an error if finding messages fails', async () => {
      jest.spyOn(model, 'find').mockRejectedValue(new Error('Find failed'));

      await expect(service.findAll('user1', 'user2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('saveReceivedMessage', () => {
    it('should save a received message', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiver_user',
        content: 'Hello!',
      };

      jest.spyOn(model, 'save').mockResolvedValue(mockMessage as any);

      await service.saveReceivedMessage(createMessageDto);
      expect(model.save).toHaveBeenCalled();
    });

    it('should throw an error if message saving fails', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiver_user',
        content: 'Hello!',
      };

      jest.spyOn(model, 'save').mockRejectedValue(new Error('Save failed'));

      await expect(
        service.saveReceivedMessage(createMessageDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendNotification', () => {
    it('should send a notification', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiver_user',
        content: 'Hello!',
      };

      jest
        .spyOn(notificationService, 'sendNotification')
        .mockResolvedValue(undefined);

      await service.sendNotification(createMessageDto);

      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        'receiver_user',
        'Anda memiliki pesan baru',
      );
    });

    it('should throw an error if sending notification fails', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: 'receiver_user',
        content: 'Hello!',
      };

      jest
        .spyOn(notificationService, 'sendNotification')
        .mockRejectedValue(new Error('Send failed'));

      await expect(service.sendNotification(createMessageDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
