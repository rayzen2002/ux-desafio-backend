import { Injectable } from "@nestjs/common";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import { db } from "src/db";
import  { cartItems, carts, products } from "src/db/schema";

export type Carts = InferSelectModel<typeof carts>;

@Injectable()
export class CartRepository {
 async createCart(userId: string){
  const [cart] = await db.insert(carts).values({ userId }).returning()

  return {...cart , items: [] }
 }

 async findCartByUserId(userId: string) {
  const [cart] = await db.select().from(carts).where(eq(carts.userId, userId))
  if(!cart) return null

  const items = await db
  .select({
    id: cartItems.id,
    productId: cartItems.productId,
    quantity: cartItems.quantity,
    name: products.name,
    price: products.price,
    imageUrl: products.imageUrl,
  })
  .from(cartItems)
  .innerJoin(products, eq(products.id, cartItems.productId))
  .where(eq(cartItems.cartId, cart.id))

  return { ...cart, items}
}

async addProduct(cartId: string, productId: number, quantity: number = 1){
  const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)));

  if (existing) {
    const [updated] = await db
    .update(cartItems)
    .set({quantity: existing.quantity + quantity})
    .where(eq(cartItems.id, existing.id))
    .returning()

    return updated
  }

  const [item] = await db
  .insert(cartItems)
  .values({ cartId, productId, quantity })
  .returning()

  return item
}

async removeProduct(cartId: string, productId: number) {
  await db
  .delete(cartItems)
  .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
}

async clearCart(cartId: string){
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId))
}

}