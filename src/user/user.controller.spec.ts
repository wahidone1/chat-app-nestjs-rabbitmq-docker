import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    findOne: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const result = { username: 'john', name: 'John Doe' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(result as any);

      expect(
        await userController.getProfile({ user: { username: 'john' } }),
      ).toBe(result);
    });

    it('should handle errors', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new Error('User not found'));

      await expect(
        userController.getProfile({ user: { username: 'john' } }),
      ).rejects.toThrowError('User not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile with photo', async () => {
      const updateDto = { name: 'John Doe', photo: 'photo.jpg' };
      const file = { filename: 'photo.jpg' } as Express.Multer.File;
      jest
        .spyOn(userService, 'update')
        .mockResolvedValue({ username: 'john', ...updateDto } as any);

      expect(
        await userController.updateProfile(
          { user: { username: 'john' } },
          updateDto,
          file,
        ),
      ).toEqual({ username: 'john', ...updateDto });
    });

    it('should update user profile without photo', async () => {
      const updateDto = { name: 'John Doe' };
      jest
        .spyOn(userService, 'update')
        .mockResolvedValue({ username: 'john', ...updateDto } as any);

      expect(
        await userController.updateProfile(
          { user: { username: 'john' } },
          updateDto,
          null,
        ),
      ).toEqual({ username: 'john', ...updateDto });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(userService, 'update')
        .mockRejectedValue(new BadRequestException('Update failed'));

      await expect(
        userController.updateProfile(
          { user: { username: 'john' } },
          { name: 'John Doe' },
          null,
        ),
      ).rejects.toThrowError('Update failed');
    });
  });
});
