import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { NotificationService } from '../notification/notification.service'; // Import notifikasi service

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly notificationService: NotificationService, // Tambahkan notifikasi service
  ) {}

  async sendMessage(
    username: string,
    createMessageDto: CreateMessageDto,
  ): Promise<void> {
    console.log(username);
    const message = new this.messageModel({
      ...createMessageDto,
      sender: username,
      date: new Date(), // Tambahkan timestamp
    });
    await message.save();
    this.notificationService.sendNotification(
      createMessageDto.receiver,
      'Anda memiliki pesan baru',
    );
  }

  async findAll(user1: string, user2: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      })
      .exec();
  }

  async saveReceivedMessage(createMessageDto: CreateMessageDto): Promise<void> {
    const message = new this.messageModel({
      ...createMessageDto,
      timestamp: new Date(), // Tambahkan timestamp
    });
    await message.save();
  }

  async sendNotification(message: CreateMessageDto): Promise<void> {
    this.notificationService.sendNotification(
      message.receiver,
      'Anda memiliki pesan baru',
    );
  }
}
