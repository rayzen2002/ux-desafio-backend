import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  AddToCartSchema,
  RemoveFromCartSchema,
  type AddToCartDto,
  type RemoveFromCartDto,
} from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  @UsePipes(new ZodValidationPipe(AddToCartSchema))
  async addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(
      req.user.userId,
      dto.productId,
      dto.quantity,
    );
  }

  @Delete('remove')
  @UsePipes(new ZodValidationPipe(RemoveFromCartSchema))
  async removeFromCart(@Req() req: any, @Body() dto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(req.user.userId, dto.productId);
  }

  @Delete('clear')
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}
