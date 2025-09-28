import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository, type Product } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepository) {}

  async listProducts(page: number, limit: number, name?: string) : Promise<{
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}> {
    return this.productsRepo.findAll(page, limit, name);
  }

  async createProduct(dto: any, userRole: string) {
    if (userRole !== 'admin')
      throw new ForbiddenException(
        'Apenas administradores podem criar produtos!',
      );
    return this.productsRepo.create(dto, userRole);
  }
  async updateProduct(id: number, dto: any, userRole: string) {
    if (userRole !== 'admin')
      throw new ForbiddenException(
        'Apenas administradores podem atualizar os produtos!',
      );

    const product = await this.productsRepo.update(id, dto);
    if (!product) throw new NotFoundException('Produto não encontrado');

    return product;
  }
  async removeProduct(id: number, userRole: string) {
    if (userRole !== 'admin')
      throw new ForbiddenException(
        'Apenas administradores podem excluir os produtos!',
      );

    const product = await this.productsRepo.findById(id);

    await this.productsRepo.remove(id);
    return { message: 'Produto removido com sucesso' };
  }
}
