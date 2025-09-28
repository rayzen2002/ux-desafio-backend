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
import {  ApiOperation,  ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreateOperation, ApiDeleteOperation, ApiListOperation, ApiUpdateOperation } from '../common/decorators/api-decorators';

@ApiTags('produtos')
@Controller('products')
@UseGuards(JwtAuthGuard, new RolesGuard(['user','admin']))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiListOperation('produtos')
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
  @ApiCreateOperation('produtos')
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async create(@Body() dto: CreateProductDto, @Req() req: any) {
    const role = req.user?.role ?? 'user';
    return this.productsService.createProduct(dto, role);
  }

  @Put(':id')
  @ApiUpdateOperation('produto')
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    const role = req.user?.role ?? 'user';
    return this.productsService.updateProduct(Number(id), dto, role);
  }

  @Delete(':id')
  @ApiDeleteOperation('produto')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  async remove(@Param('id') id: string, @Req() req: any) {
    const role = req.user?.role ?? 'user';
    return this.productsService.removeProduct(Number(id), role);
  }
}
