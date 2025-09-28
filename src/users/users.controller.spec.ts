import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            CreateUser: jest.fn(),
            activateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        cpf: '12345678900',
      };
      
      const expectedResponse = {
        id: '1',
        email: 'test@example.com',
      };
      
      (service.CreateUser as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);
      
      expect(result).toEqual(expectedResponse);
      expect(service.CreateUser).toHaveBeenCalledWith(registerDto);
    });

    it('should handle registration errors', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        cpf: '12345678900',
      };
      
      const error = new ConflictException('Email já cadastrado');
      (service.CreateUser as jest.Mock).mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('confirm', () => {
    it('should confirm user activation successfully', async () => {
      const token = 'validToken';
      
      (service.activateUser as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.confirm(token);
      
      expect(result).toEqual({
        message: 'Usuário ativado com sucesso!',
      });
      expect(service.activateUser).toHaveBeenCalledWith(token);
    });

    it('should handle invalid token', async () => {
      const token = 'invalidToken';
      
      const error = new UnauthorizedException('Token inválido ou expirado');
      (service.activateUser as jest.Mock).mockRejectedValue(error);

      await expect(controller.confirm(token)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle already active user', async () => {
      const token = 'alreadyActiveToken';
      
      const error = new ConflictException('Usuário já está ativo');
      (service.activateUser as jest.Mock).mockRejectedValue(error);

      await expect(controller.confirm(token)).rejects.toThrow(ConflictException);
    });
  });
});