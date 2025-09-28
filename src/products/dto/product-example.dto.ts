// src/products/dto/product-swagger.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseSwaggerDto {
  @ApiProperty({
    example: 1,
    description: 'ID único do produto'
  })
  id: number

  @ApiProperty({
    example: 'Notebook Dell',
    description: 'Nome do produto',
    maxLength: 100
  })
  name: string

  @ApiProperty({
    example: 'Notebook Dell ryzen 7 3500 16GB RAM 512GB SSD RTX 3070 TI',
    description: 'Descrição delhada do produto',
    required: false,
    maxLength: 500,
  })
  description?: string

  @ApiProperty({
    example: "8500.99",
    description: 'Preço do produto em R$',
  })
  price: string
   @ApiProperty({
    example: 'http://exemplo.com/notebook.jpg',
    description: 'URL da imagem do produto',
    required: false,
    nullable: true
  })
  imageUrl?: string
  
  @ApiProperty({
    example: '2025-09-25T17:56:31.305Z',
    description: 'Data de criação do produto'
  })
  createdAt: Date

  @ApiProperty({
    example: '2025-09-25T17:56:31.305Z',
    description: 'Data da ultima atualização do produto'
  })
  updatedAt: Date
}
 
export class PaginatedProductsSwaggerDto {
  @ApiProperty({
    description: 'Array de produtos',
    type: [ProductResponseSwaggerDto],
    example: [
      {
        id: 2,
        name: "Smartphone XYZ",
        description: "Smartphone com tela AMOLED de 6.5\", 128GB de armazenamento e 8GB de RAM.",
        imageUrl: "https://exemplo.com/images/smartphone_xyz.jpg",
        price: "1599.99",
        createdAt: "2025-09-25T17:56:31.305Z",
        updatedAt: "2025-09-25T17:56:31.305Z"
      },
      {
        id: 1,
        name: "Notebook Dell",
        description: "Notebook Dell Ryzen 7 3700 16GB RAM 512GB SSD RTX 3070 TI",
        imageUrl: 'https://exemplo.com/images/notebook.jpg',
        price: "8000.00",
        createdAt: "2025-09-25T17:09:07.321Z",
        updatedAt: "2025-09-27T21:14:39.737Z"
      }
    ]
  })
  data: ProductResponseSwaggerDto[]
  @ApiProperty({
    example: 5,
    description: 'Total de produtos em todas as páginas'
  })
  total: number
  @ApiProperty({
    example: 1,
    description: 'Pagina atual'
  })
  page: number
  @ApiProperty({
    example: 10,
    description: 'Quantidade de produtos por página'
  })
  limit: number
  @ApiProperty({
    example: 1,
    description: 'Total de paginas disponíveis',
  })
  totalPages: number
  @ApiProperty({
    example: false,
    description: 'Indica se existe próxima página'
  })
  hasNext: boolean
  @ApiProperty({
    example: false,
    description: 'Indica se existe página anterior'
  })
  hasPrev: boolean
}


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

