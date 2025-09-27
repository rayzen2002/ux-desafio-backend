import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
    it('should register a user', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        cpf: '12345678900',
      };
      const createdUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        phone: null,
        cpf: '12345678900',
        is_active: false,
        confirm_token: 'token',
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(service, 'CreateUser').mockResolvedValue(createdUser);

      const result = await controller.register(registerDto);
      expect(result).toEqual(createdUser);
      expect(service.CreateUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('confirm', () => {
    it('should confirm user activation', async () => {
      const token = 'validToken';
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
      jest.spyOn(service, 'activateUser').mockResolvedValue(activatedUser);

      const result = await controller.confirm(token);
      expect(result).toEqual({
        message: `Usuário ${activatedUser.email} ativado com sucesso!`,
      });
      expect(service.activateUser).toHaveBeenCalledWith(token);
    });
  });
});
