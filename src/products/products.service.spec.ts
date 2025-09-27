import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    imageUrl: 'http.test-image.com',
    price: '150.50',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };
  const mockProducts = {
    data: [mockProduct],
    total: 1,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('listProducts', () => {
    it('should list all products', async () => {
      (repository.findAll as jest.Mock).mockResolvedValue(mockProducts);
      const result = await service.listProducts(2, 15, 'test');
      expect(result).toEqual(mockProducts);
      expect(repository.findAll).toHaveBeenCalledWith(2, 15, 'test');
    });
  });
  describe('createProduct', () => {
    it('should create a new product', async () => {
      (repository.create as jest.Mock).mockResolvedValue(mockProduct);
      const result = await service.createProduct(mockProduct, 'admin');
      expect(result).toEqual(mockProduct);
      expect(repository.create).toHaveBeenCalledWith(mockProduct, 'admin');
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
    it('should receive Unauthorized to create a product as user', async () => {
      await expect(service.createProduct(mockProduct, 'user')).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.createProduct(mockProduct, 'user')).rejects.toThrow(
        'Apenas administradores podem criar produtos!',
      );
    });
  });
  describe('UpdateProduct', () => {
    const updateDto = {
      name: 'Produto Atualizado',
      price: '200.00',
      description: 'Nova descrição',
    };

    const updatedProduct = {
      ...mockProduct,
      ...updateDto,
      updated_at: new Date('2024-01-02'),
    };
    it('should update product when user is admin and product exists', async () => {
      (repository.update as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(1, updateDto, 'admin');

      expect(result).toEqual(updatedProduct);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });
    it('should throw NotFoundException when product does not exist', async () => {
      (repository.update as jest.Mock).mockResolvedValue(null);
      await expect(
        service.updateProduct(999, updateDto, 'admin'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.updateProduct(999, updateDto, 'admin'),
      ).rejects.toThrow('Produto não encontrado');
    });
    it('should throw ForbiddenException when user is not admin', async () => {
      await expect(service.updateProduct(1, updateDto, 'user')).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.updateProduct(1, updateDto, 'user')).rejects.toThrow(
        'Apenas administradores podem atualizar os produtos!',
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
    it('should update products with different IDs', async () => {
      (repository.update as jest.Mock).mockImplementation((id, data) => {
        return Promise.resolve({ ...data, id });
      });

      const result2 = await service.updateProduct(2, updateDto, 'admin');
      const result3 = await service.updateProduct(3, updateDto, 'admin');

      expect(result2.id).toBe(2);
      expect(result3.id).toBe(3);
      expect(repository.update).toHaveBeenCalledWith(2, updateDto);
      expect(repository.update).toHaveBeenCalledWith(3, updateDto);
    });
  });
});
