import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}
  private enrichCartWithTotal(cart: any) {
    const total = cart.items.reduce((sum: number, item: any) => {
      // Converte o preço de string (numeric) para número
      const price = parseFloat(item.price);
      return sum + (price * item.quantity);
    }, 0);

    return {
      ...cart,
      total: Number(total.toFixed(2)),
      itemsCount: cart.items.reduce((count: number, item: any) => count + item.quantity, 0)
    };
  }

  async getCart(userId: string) {
    let cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
      return  this.enrichCartWithTotal(cart) ;
    }
    return this.enrichCartWithTotal(cart);
  }
 

  async addToCart(userId: string, productId: number, quantity: number) {
    let cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }
    return this.cartRepository.addProduct(cart.id, productId, quantity);
  }
  async removeFromCart(userId: string, productId: number) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) throw new Error('Carrinho não encontrado');

    return this.cartRepository.removeProduct(cart.id, productId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) throw new Error('Carrinho não encontrado');
    await this.cartRepository.clearCart(cart.id);
  }
  async updateQuantity(userId: string, productId: number, quantity: number) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) throw new Error('Carrinho não encontrado');
    if (quantity <= 0) {
      await this.cartRepository.removeProduct(cart.id, productId);
    } else {
      await this.cartRepository.removeProduct(cart.id, productId);
      await this.cartRepository.addProduct(cart.id, productId, quantity);
    }
    
    return this.getCart(userId);
  }
}
