import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

jest.mock('bcrypt', () => ({
  hash: jest.fn((password, salt) => 'hashedPassword'),
}));
jest.mock('crypto', () => ({
  randomBytes: jest.fn((size) => ({
    toString: jest.fn(() => 'confirmToken'),
  })),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            activateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user' as const,
        phone: null,
        cpf: '12345678900',
        is_active: true,
        confirm_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findByEmail').mockResolvedValue([user]);

      expect(await service.findByEmail('test@example.com')).toEqual(user);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue([]);

      expect(await service.findByEmail('test@example.com')).toBeNull();
    });
  });

  describe('CreateUser', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: undefined,
      cpf: '12345678900',
    };

    it('should create a new user if email is not already registered', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue([]);
      jest.spyOn(repository, 'create').mockResolvedValue({
        id: '1',
        name: userData.name,
        email: userData.email,
        password: 'hashedPassword',
        role: 'user' as const,
        phone: userData.phone || null,
        cpf: userData.cpf,
        is_active: false,
        confirm_token: 'confirmToken',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.CreateUser(userData);
      expect(result).toEqual({
        id: '1',
        email: userData.email,
        confirm_token: 'confirmToken',
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword',
        is_active: false,
        confirm_token: 'confirmToken',
      });
    });

    it('should throw ConflictException if email is already registered', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue([
        {
          id: '1',
          name: userData.name,
          email: userData.email,
          password: 'hashedPassword',
          role: 'user' as const,
          phone: null,
          cpf: userData.cpf,
          is_active: true,
          confirm_token: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      await expect(service.CreateUser(userData)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.CreateUser(userData)).rejects.toThrow(
        'Email já cadastrado',
      );
    });
  });

  describe('activateUser', () => {
    it('should activate a user with a valid token', async () => {
      const activatedUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user' as const,
        phone: null,
        cpf: '12345678900',
        is_active: true,
        confirm_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'activateUser').mockResolvedValue(activatedUser);

      expect(await service.activateUser('validToken')).toEqual(activatedUser);
    });
  });
});
