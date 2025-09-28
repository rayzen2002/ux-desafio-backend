import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { EmailConfirmationService } from '../users/email-confirmation.service';

// Mocks corretos
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'), // ✅ Corrigido
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({ // ✅ Corrigido
    toString: jest.fn().mockReturnValue('confirmToken123'),
  }),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let emailConfirmationService: EmailConfirmationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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
          provide: EmailConfirmationService,
          useValue: {
            generateConfirmationToken: jest.fn(),
            verifyConfirmationToken: jest.fn(),
            removeConfirmationToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    emailConfirmationService = module.get<EmailConfirmationService>(EmailConfirmationService);
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
      
      // ✅ Corrigido: passe o valor para mockResolvedValue
      (repository.findByEmail as jest.Mock).mockResolvedValue([user]);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      // ✅ Corrigido: passe o valor para mockResolvedValue
      (repository.findByEmail as jest.Mock).mockResolvedValue([]);

      const result = await service.findByEmail('test@example.com');
      expect(result).toBeNull();
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
      // ✅ Corrigido: passe os valores para mockResolvedValue
      (repository.findByEmail as jest.Mock).mockResolvedValue([]);
      
      (repository.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: userData.name,
        email: userData.email,
        password: 'hashedPassword',
        role: 'user' as const,
        phone: userData.phone || null,
        cpf: userData.cpf,
        is_active: false,
        confirm_token: 'confirmToken123',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // ✅ Corrigido: passe o valor para mockResolvedValue
      (emailConfirmationService.generateConfirmationToken as jest.Mock)
        .mockResolvedValue('confirmToken123');

      const result = await service.CreateUser(userData);
      
      expect(result).toEqual({
        id: '1',
        email: userData.email,
      });
      
      expect(repository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword',
        is_active: false,
        confirm_token: 'confirmToken123',
      });
      
      expect(emailConfirmationService.generateConfirmationToken)
        .toHaveBeenCalledWith('1', userData.email, 'confirmToken123');
    });

    it('should throw ConflictException if email is already registered', async () => {
      // ✅ Corrigido: passe o valor para mockResolvedValue
      (repository.findByEmail as jest.Mock).mockResolvedValue([
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

      await expect(service.CreateUser(userData)).rejects.toThrow(ConflictException);
      await expect(service.CreateUser(userData)).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('activateUser', () => {
    it('should activate a user with a valid token', async () => {
      const mockVerificationResult = {
        userId: '1',
        email: 'test@example.com'
      };

      // ✅ Corrigido: passe os valores para mockResolvedValue
      (emailConfirmationService.verifyConfirmationToken as jest.Mock)
        .mockResolvedValue(mockVerificationResult);
      
      (emailConfirmationService.removeConfirmationToken as jest.Mock)
        .mockResolvedValue(undefined);

      // ✅ Corrigido: passe o valor para mockResolvedValue
      (repository.findById as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user' as const,
        phone: null,
        cpf: '12345678900',
        is_active: false,
        confirm_token: 'confirmToken123',
        created_at: new Date(),
        updated_at: new Date(),
      });

      (repository.updateUser as jest.Mock).mockResolvedValue({
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
      });

      await service.activateUser('validToken');

      expect(emailConfirmationService.verifyConfirmationToken)
        .toHaveBeenCalledWith('validToken');
      expect(repository.updateUser).toHaveBeenCalledWith('1', {
        is_active: true,
        confirm_token: null
      });
      expect(emailConfirmationService.removeConfirmationToken)
        .toHaveBeenCalledWith('validToken');
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      // ✅ Corrigido: passe o valor para mockResolvedValue
      (emailConfirmationService.verifyConfirmationToken as jest.Mock)
        .mockResolvedValue(null);

      await expect(service.activateUser('invalidToken')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ConflictException if user is already active', async () => {
      const mockVerificationResult = {
        userId: '1',
        email: 'test@example.com'
      };

      // ✅ Corrigido: passe o valor para mockResolvedValue
      (emailConfirmationService.verifyConfirmationToken as jest.Mock)
        .mockResolvedValue(mockVerificationResult);

      // ✅ Corrigido: passe o valor para mockResolvedValue
      (repository.findById as jest.Mock).mockResolvedValue({
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
      });

      await expect(service.activateUser('validToken')).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '1';
      const updateData = {
        name: 'Updated Name',
        phone: '123456789',
      };

      const existingUser = {
        id: userId,
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

      // ✅ Corrigido: passe os valores para mockResolvedValue
      (repository.findById as jest.Mock).mockResolvedValue(existingUser);
      (repository.findByEmail as jest.Mock).mockResolvedValue([]);
      (repository.updateUser as jest.Mock).mockResolvedValue({
        ...existingUser,
        ...updateData,
        updated_at: new Date(),
      });

      const result = await service.updateUser(userId, updateData, 'user');

      expect(result.name).toBe('Updated Name');
      expect(result.phone).toBe('123456789');
    });
  });
});