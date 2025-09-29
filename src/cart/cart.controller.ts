import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  AddToCartSchema,
  RemoveFromCartSchema,
  type AddToCartDto,
  type RemoveFromCartDto,
} from './dto/cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/jwt.guard';
import { ApiCreateCartOperation, ApiDeleteCartItemOperation, ApiDeleteCartOperation, ApiGetCartOperation, ApiUpdateQuantityInCartOperation } from '../common/decorators/api-decorators';


@ApiTags('carrinho')
@Controller('cart')
@UseGuards(JwtAuthGuard, new RolesGuard(['user','admin']))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiGetCartOperation('carrinho')
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('add')
  @ApiCreateCartOperation('carrinho')
  @UsePipes(new ZodValidationPipe(AddToCartSchema))
  async addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(
      req.user.userId,
      dto.productId,
      dto.quantity,
    );
  }

  @Delete('remove')
  @ApiDeleteCartItemOperation('carrinho')
  @UsePipes(new ZodValidationPipe(RemoveFromCartSchema))
  async removeFromCart(@Req() req: any, @Body() dto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(req.user.userId, dto.productId);
  }

  @Delete('clear')
  @ApiDeleteCartOperation('carrinho')
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
  @Put('items/:productId')
  @ApiUpdateQuantityInCartOperation('carrinho')
  async updateQuantity(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateCartDto: any
  ) {
    const userId = req.user.userId; 
    return this.cartService.updateQuantity(userId, productId, updateCartDto.quantity);
  }
}
