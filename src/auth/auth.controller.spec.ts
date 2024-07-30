import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with the correct parameters', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'testpass',
      };
      const result = { access_token: 'testtoken' };

      jest.spyOn(authService, 'register').mockResolvedValue(result as any);

      expect(await authController.register(registerDto)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with the correct parameters', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'testpass' };
      const result = { access_token: 'testtoken' };

      jest.spyOn(authService, 'login').mockResolvedValue(result as any);

      expect(await authController.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
