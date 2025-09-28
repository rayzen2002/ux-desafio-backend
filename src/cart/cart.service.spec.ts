import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { ProductsService } from '../products/products.service';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: CartRepository;

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
      providers: [
        CartService,
        CartRepository,
        {
          provide: ProductsService, 
          useValue: mockProductsService
        }
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<CartRepository>(CartRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have cartRepository defined', () => {
    expect(cartRepository).toBeDefined();
  });
});