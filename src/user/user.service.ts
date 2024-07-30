import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AstrologyService } from '../common/services/astrology.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly astrologyService: AstrologyService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel({
        ...createUserDto,
        birthdate: createUserDto.birthdate || new Date(),
        name: createUserDto.name || 'anon',
        photo: createUserDto.photo || 'default.jpg',
      });
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new BadRequestException(`Error fetching users: ${error.message}`);
    }
  }

  async findOne(username: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(`Error finding user: ${error.message}`);
    }
  }

  async update(username: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { birthdate } = updateUserDto;
      let horoscope: string | undefined;
      let zodiac: string | undefined;

      if (birthdate) {
        const birthDateObject = new Date(birthdate);
        horoscope = this.astrologyService.determineHoroscope(birthDateObject);
        zodiac = this.astrologyService.determineZodiac(birthDateObject);
      }

      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { username },
          { ...updateUserDto, horoscope, zodiac },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with username ${username} not found`);
      }

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(`Error updating user: ${error.message}`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(
        `Error finding user by ID: ${error.message}`,
      );
    }
  }
}
