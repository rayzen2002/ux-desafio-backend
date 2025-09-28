import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmationService } from '../users/email-confirmation.service';
import { RedisHelper } from '../../infra/redis/utils/redis-helpers';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            CreateUser: jest.fn(),
            activateUser: jest.fn(),
            updateUser: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updateUser: jest.fn(),
            findById: jest.fn(),
            activateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: EmailConfirmationService,
          useValue: {
            generateConfirmationToken: jest.fn(),
            verifyConfirmationToken: jest.fn(),
            removeConfirmationToken: jest.fn(),
          },
        },
        {
          provide: RedisHelper,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
            delByPattern: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});