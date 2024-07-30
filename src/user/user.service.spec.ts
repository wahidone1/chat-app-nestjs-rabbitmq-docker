// src/user/user.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AstrologyService } from '../common/services/astrology.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let astrologyService: AstrologyService;

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  const mockAstrologyService = {
    determineHoroscope: jest.fn().mockReturnValue('Leo'),
    determineZodiac: jest.fn().mockReturnValue('Aries'),
  };

  const mockUser = {
    username: 'john_doe',
    email: 'john@example.com',
    name: 'John Doe',
    birthdate: new Date('1990-01-01'),
    height: 175,
    weight: 70,
    horoscope: 'Leo',
    zodiac: 'Aries',
    photo: 'default.jpg',
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: AstrologyService,
          useValue: mockAstrologyService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
    astrologyService = module.get<AstrologyService>(AstrologyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(model, 'save').mockResolvedValue(mockUser as any);
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        email: 'john@example.com',
        name: 'John Doe',
        birthdate: new Date('1990-01-01'),
        height: 175,
        weight: 70,
        horoscope: 'Leo',
        zodiac: 'Aries',
        photo: 'default.jpg',
      };
      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw a BadRequestException if there is an error', async () => {
      jest.spyOn(model, 'save').mockRejectedValue(new Error('Error'));
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        email: 'john@example.com',
      };
      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockUser] as any);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });

    it('should throw a BadRequestException if there is an error', async () => {
      jest.spyOn(model, 'find').mockRejectedValue(new Error('Error'));
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUser as any);
      const result = await service.findOne('john_doe');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('non_existing_user')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a BadRequestException if there is an error', async () => {
      jest.spyOn(model, 'findOne').mockRejectedValue(new Error('Error'));
      await expect(service.findOne('john_doe')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(mockUser as any);
      const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };
      const result = await service.update('john_doe', updateUserDto);
      expect(result).toEqual(mockUser);
      expect(astrologyService.determineHoroscope).toHaveBeenCalled();
      expect(astrologyService.determineZodiac).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(null);
      await expect(service.update('non_existing_user', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a BadRequestException if there is an error', async () => {
      jest
        .spyOn(model, 'findOneAndUpdate')
        .mockRejectedValue(new Error('Error'));
      await expect(service.update('john_doe', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockUser as any);
      const result = await service.findOneById('some_id');
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      await expect(service.findOneById('non_existing_id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a BadRequestException if there is an error', async () => {
      jest.spyOn(model, 'findById').mockRejectedValue(new Error('Error'));
      await expect(service.findOneById('some_id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
