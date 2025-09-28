import { Inject, Injectable } from '@nestjs/common';
import { eq, ilike, sql, type InferSelectModel } from 'drizzle-orm';
import { db } from '../../infra/db';
import { products } from '../../infra/db/schema';
import type { CreateProductDto } from './dto/create-products.dto';
import { RedisHelper } from '../../infra/redis/utils/redis-helpers';

export type Product = InferSelectModel<typeof products>;

@Injectable()
export class ProductsRepository {
  constructor(private readonly redisHelper: RedisHelper) {}
  async findAll(
  page = 1,
  limit = 10,
  name?: string,
): Promise<{ 
  data: Product[]; 
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}> {
  const cacheKey = `products:all:page=${page}:limit=${limit}:name=${name ?? 'all'}`;
  const cached = await this.redisHelper.get<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>(cacheKey);

  if (cached) {
    console.log('retorno cacheado do redis');
    return cached;
  }

  const offset = (page - 1) * limit;
  const where = name ? ilike(products.name, `%${name}%`) : undefined;

  const data = await db
    .select()
    .from(products)
    .where(where)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where);

  const total = Number(count);
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const result = { 
    data, 
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev
  };
  
  await this.redisHelper.set(cacheKey, result, 60);
  return result;
}

  async findById(id: number) {
    const cacheKey = `products:${id}`;
    const cached = await this.redisHelper.get<Product>(cacheKey);

    if (cached) {
      console.log('retorno cacheado do redis');
      return cached;
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (product) {
      await this.redisHelper.set(cacheKey, product, 60);
      console.log('retorno cacheado do redis');
    }
    return product;
  }

  async create(data: CreateProductDto, role: string): Promise<Product> {
    if (role !== 'admin') throw new Error('Only admins can create products');
    const [product] = await db
      .insert(products)
      .values({
        name: data.name,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        price: data.price.toString(),
      })
      .returning();

    await this.redisHelper.delByPattern('products:all*');
    console.log('Cache anterior deletado');

    return product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (product) {
      await this.redisHelper.set(`products:${id}`, product, 60);
      console.log('Cache salvo');
      await this.redisHelper.delByPattern('products:all*');
      console.log('Cache anterior deletado');
    }

    return product ?? null;
  }

  async remove(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
    await this.redisHelper.delByPattern(`products:${id}`);
    await this.redisHelper.delByPattern('products:all*');
  }
}
