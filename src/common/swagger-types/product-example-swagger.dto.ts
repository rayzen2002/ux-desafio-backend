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


export class GetCartSwaggerDtoResponse {
  @ApiProperty({
    example: '368df346-e0d7-45fb-bd46-6d9cc25e0049',
    description: 'Id do Carrinho',
  })
  id: string
  @ApiProperty({
    example: '397ce346-e0d7-45fb-bd46-6d9rh25e0049',
    description: 'Id do usuário'
  })
  userId: string
  @ApiProperty({
    example: '2025-09-28T19:07:55.772',
    description: 'Data de criação do carrinho',
  })
  createdAt: Date
   @ApiProperty({
    example: '2025-09-28T19:07:55.772',
    description: 'Data de atualização do carrinho',
  })
  updatedAd: Date
@ApiProperty({
    type: [ProductResponseSwaggerDto], 
    description: 'Itens do carrinho',
    example: [
      {
        id: 1,
        productId: 1,
        quantity: 2,
        name: 'Produto A',
        price: '29.99',
        imageUrl: 'https://example.com/image.jpg'
      }
    ]
  })
  items: ProductResponseSwaggerDto[];
 @ApiProperty({
  example: "59.98",
  description: 'Valor total dos itens do carrinho'
 })
 total: number
 @ApiProperty({
  example: 2,
  description: 'Total de itens no carrinho'
 })
 itemsCount: number
}

export class CreateCartSwaggerDtoBody{
  @ApiProperty({
    example: 1,
    description: "Id do produto a ser adicionado"
  })
  productId: number
  @ApiProperty({
    example: 2,
    description: 'Quantidade de itens a ser adicionados'
  })
  quantity: number
}

export class CreateCartSwaggerDtoResponse {
  @ApiProperty({
    example: 10,
    description: 'ID único do item no carrinho'
  })
  id: number;

  @ApiProperty({
    example: '368ce346-e0d7-45fb-bd46-6d9cc25e0049',
    description: 'ID do carrinho ao qual o item pertence'
  })
  cartId: string;

  @ApiProperty({
    example: 4,
    description: 'ID do produto'
  })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do produto no carrinho'
  })
  quantity: number;

  @ApiProperty({
    example: '2025-09-28T19:28:03.225Z',
    description: 'Data de criação do item no carrinho'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-09-28T19:28:03.225Z',
    description: 'Data da última atualização do item no carrinho'
  })
  updatedAt: Date;
}
export class DeleteCartItemSwaggerDtoBody{
  @ApiProperty({
    example: 2,
    description: 'Id do produto a ser deletado do carrinho'
  })
  productId: number
}

export class UpdateCartItemSwaggerDtoBody{
  @ApiProperty({
    example: 2,
    description: 'Quantidade do produto a ser atualizado do carrinho'
  })
  quantity: number
}
export class UpdateCartItemSwaggerDtoResponse {
  @ApiProperty({
    example: '368df346-e0d7-45fb-bd46-6d9cc25e0049',
    description: 'Id do Carrinho',
  })
  id: string;

  @ApiProperty({
    example: '397ce346-e0d7-45fb-bd46-6d9rh25e0049',
    description: 'Id do usuário'
  })
  userId: string;

  @ApiProperty({
    example: '2025-09-28T19:07:55.772',
    description: 'Data de criação do carrinho',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-09-28T19:07:55.772',
    description: 'Data de atualização do carrinho',
  })
  updatedAt: Date;

  @ApiProperty({
    type: ProductResponseSwaggerDto,
    description: 'Item do carrinho atualizado',
    example: {
      id: 1,
      productId: 1,
      quantity: 3,
      name: 'Produto A',
      price: '29.99',
      imageUrl: 'https://example.com/image.jpg'
    }
  })
  items: ProductResponseSwaggerDto; 
  @ApiProperty({
    example: 89.97,
    description: 'Valor total dos itens do carrinho'
  })
  total: number
  @ApiProperty({
    example: 3,
    description: 'Total do produto atualizado no carrinho'
  })
  itemsCount: number
}