import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';

describe('CartController', () => {
  let controller: CartController;

  const mockProductsService = {
    findProductById: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test Product',
      price: '29.99',
      description: 'Test Description',
      imageUrl: 'test.jpg'
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        CartRepository,
        {
          provide: ProductsService, 
          useValue: mockProductsService
        }
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});