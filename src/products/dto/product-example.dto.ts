// src/products/dto/product-swagger.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSwaggerDto {
  @ApiProperty({
    example: 'Notebook Dell Inspiron',
    description: 'Nome do produto',
    maxLength: 100
  })
  name: string;

  @ApiProperty({
    example: 'Notebook Dell i7 16GB RAM 512GB SSD',
    description: 'Descrição detalhada do produto',
    required: false,
    maxLength: 500
  })
  description?: string;

    @ApiProperty({
    example: 'http://exemplo.com/imagem.jpg',
    description: 'URL da imagem do produto',
    required: false
  })
  imageUrl?: string;
  
  @ApiProperty({
    example: '3500.00',
    description: 'Preço do produto em Reais'
  })
  price: string;


}

export class UpdateProductSwaggerDto {
  @ApiProperty({
    example: 'Notebook Dell Atualizado',
    required: false
  })
  name?: string;

  @ApiProperty({
    example: 'Nova descrição com mais detalhes...',
    required: false
  })
  description?: string;

  @ApiProperty({
    example: '3200.00',
    required: false
  })
  price?: string;

  @ApiProperty({
    example: 'http://exemplo.com/nova-imagem.jpg',
    required: false
  })
  imageUrl?: string;
}

export class PaginationSwaggerDto {
  @ApiProperty({
    example: 1,
    description: 'Número da página',
    required: false,
    default: 1
  })
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Itens por página',
    required: false,
    default: 10
  })
  limit?: number;

  @ApiProperty({
    example: 'notebook',
    description: 'Filtrar por nome',
    required: false
  })
  name?: string;
}