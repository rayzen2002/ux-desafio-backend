import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async getCart(userId: string) {
    let cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
      return { ...cart, items: [] };
    }
    return cart;
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
}
