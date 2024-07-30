import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user data without password if validation is successful', async () => {
      const mockUser = {
        username: 'testuser',
        password: bcrypt.hashSync('testpass', 10),
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await service.validateUser('testuser', 'testpass');
      expect(result).toEqual({ username: 'testuser' });
    });

    it('should return null if validation fails', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('testuser', 'testpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token for valid user', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'testpass' };
      const mockUser = {
        username: 'testuser',
        password: bcrypt.hashSync('testpass', 10),
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('testtoken');

      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'testtoken' });
    });

    it('should return null for invalid user', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'testpass' };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      const result = await service.login(loginDto);
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create a new user and return access token', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'testpass',
      };
      const mockUser = {
        username: 'testuser',
        password: bcrypt.hashSync('testpass', 10),
      };

      jest.spyOn(userService, 'create').mockResolvedValue(mockUser as any);
      jest
        .spyOn(service, 'login')
        .mockResolvedValue({ access_token: 'testtoken' });

      const result = await service.register(registerDto);
      expect(result).toEqual({ access_token: 'testtoken' });
    });
  });
});
