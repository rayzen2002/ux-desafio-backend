import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateProductSchema,
  PaginationSchema,
  UpdateProductSchema,
  type CreateProductDto,
  type PaginationDto,
  type UpdateProductDto,
} from './dto/create-products.dto';
import { RolesGuard } from '../auth/jwt.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(PaginationSchema))
  async list(@Query() query: PaginationDto) {
    return this.productsService.listProducts(
      query.page,
      query.limit,
      query.name,
    );
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    const role = req.user?.role ?? 'user';
    return this.productsService.createProduct(dto, role);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    const role = req.user?.role ?? 'user';
    return this.productsService.updateProduct(Number(id), dto, role);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const role = req.user?.role ?? 'user';
    return this.productsService.removeProduct(Number(id), role);
  }
}
