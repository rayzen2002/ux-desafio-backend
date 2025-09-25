import { Injectable } from "@nestjs/common";
import { eq, ilike, sql, type InferSelectModel } from "drizzle-orm";
import { db } from "src/db";
import { products } from "src/db/schema"
import type { CreateProductDto } from "./dto/create-products.dto";

export type Product = InferSelectModel<typeof products>;

@Injectable()
export class ProductsRepository{
  async findAll(page = 1, limit = 10, name?: string): Promise<{data: Product[]; total: number}> {
    const offset = (page - 1) * limit
    const where = name ? ilike(products.name, `%${name}%`) : undefined
    
    const data = await db
    .select()
    .from(products)
    .where(where)
    .limit(limit)
    .offset(offset)

    const [{  count  }] = await db
    .select({  count: sql<number>`count(*)`  })
    .from(products)
    .where(where)
    
    return { data, total: Number(count) }
  }

  async findById(id: number){
    const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)

    return product
  }

  async create(data: CreateProductDto, role: string): Promise<Product> {
  if (role !== "admin") throw new Error("Only admins can create products");
  const [product] = await db.insert(products).values({
    name: data.name,
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
    price: data.price.toString()
  }).returning();
  return product;
}

  async update(id: number, data: Partial<Product>) : Promise<Product | null> {
    const [product] = await db
    .update(products)
    .set({...data, updatedAt: new Date()})
    .where(eq(products.id, id))
    .returning()

    return product ?? null
  }

  async remove(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id))
  }
}