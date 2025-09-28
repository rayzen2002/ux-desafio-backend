import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { CreateCartSwaggerDtoBody, CreateCartSwaggerDtoResponse, CreateProductSwaggerDto, GetCartSwaggerDtoResponse, PaginatedProductsSwaggerDto, UpdateProductSwaggerDto } from "../swagger-types/product-example-swagger.dto";
import { LoginSwaggerDto, UserRegisterSwaggerDto } from "../swagger-types/auth-example-swagger.dto";

// Decorators das rotas de produtos

export function ApiListProductOperation(resourceName: string) {
  return applyDecorators(
    ApiOperation({
      summary: `Listar ${resourceName}`,
      description: `Retorna lista paginada/filtrada de ${resourceName}`
      }),
      ApiQuery ({ name: 'page', example: '1', required: false}), 
      ApiQuery ({ name: 'limit', example: '10', required: false}), 
      ApiQuery ({ name: 'name', example: 'notebook', required: false}), 
      ApiResponse ({ status : 200 , description: 'Lista retornada com sucesso',
        type: PaginatedProductsSwaggerDto
      }),
      ApiResponse ({ status : 400 , description: 'Paramétros inválidos'}),
  )
}
export function ApiCreateProductOperation(resourceName: string){
  return applyDecorators(
    ApiOperation ({
      summary: `Criar ${resourceName}`,
      description: `Criar um novo ${resourceName} (Rota protegida apenas para admin)`
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      type: CreateProductSwaggerDto,
      description: `Dados do ${resourceName}`
    }),
    ApiResponse({
      status: 201,
      description: `${resourceName} criado com sucesso`,
      schema: {
        example: {
              id: 1,
              name: "Notebook Dell",
              price: "3500.00",
              category: "eletronicos",
              imageUrl: "http://exemplo.com/notebook.jpg",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z"            
        }
      }
    }),
          
    ApiResponse({
      status: 401,
      description: `Token JWT inválido ou expirado`
    }),
    ApiResponse({
      status: 403,
      description: `Acesso negado, apenas para administradores`
    }),
    ApiResponse({
      status: 400,
      description: `Dados inválidos`
    })
  )
}
export function ApiUpdateProductOperation(resourceName: string) {
  return applyDecorators(
    ApiOperation ({
      summary: `Atualizar ${resourceName}`,
      description: `Atualizar um  ${resourceName} (Rota protegida apenas para admin)`
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      type: CreateProductSwaggerDto,
      description: `Dados atualizados do ${resourceName}`
    }),
      ApiParam({
      name: "id",
      type: "number",
      description: `ID do ${resourceName} a ser atualizado`,
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: `${resourceName} atualizado com sucesso`,
      type: UpdateProductSwaggerDto,
      schema: {
        example: {
              id: 1,
              name: "Notebook Dell",
              price: "3500.00",
              category: "eletronicos",
              imageUrl: "http://exemplo.com/notebook.jpg",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z"            
        }
      }
    }),
          
    ApiResponse({
      status: 401,
      description: `Token JWT inválido ou expirado`
    }),
    ApiResponse({
      status: 403,
      description: `Acesso negado, apenas para administradores`
    }),
    ApiResponse({
      status: 400,
      description: `Dados inválidos`
    })
  )
}
export function ApiDeleteProductOperation(resourceName: string) {
  return applyDecorators(
    ApiOperation ({
      summary: `Deletar ${resourceName}`,
      description: `Deletar um  ${resourceName} específico (Rota protegida apenas para admin)`
    }),
    ApiBearerAuth('JWT-auth'),
    ApiParam({
      name: "id",
      type: "number",
      description: `ID do ${resourceName} a ser deletado`,
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: `${resourceName} removido com sucesso`,
    }),
          
    ApiResponse({
      status: 401,
      description: `Token JWT inválido ou expirado`
    }),
    ApiResponse({
      status: 403,
      description: `Acesso negado, apenas para administradores`
    }),
    ApiResponse({
      status: 400,
      description: `Dados inválidos`
    })
  )
}
export function ApiLoginOperation(resourceName: string){
  return applyDecorators(
    ApiOperation({
      summary: `Fazer ${resourceName}`,
      description: 'Logar na aplicação com um usuário válido',
    }),
    ApiBody({
      type: LoginSwaggerDto,
      description: `Dados do ${resourceName}`
    }),
    ApiResponse({
      status: 200,
      description: 'Login realizado'
    }),
    ApiResponse({
      status: 401,
      description: 'Credenciais inválidas'
    })
  )
}
export function ApiUserRegisterOperation(resourceName : string){
  return applyDecorators(
    ApiOperation({
      summary: `${resourceName} de usuário`,
      description: 'Registrar usuário na aplicação'
    }),
    ApiBody({
      type: UserRegisterSwaggerDto,
      description: 'Dados para cadastro do usuário'
    })
  )
}
export function ApiGetCartOperation(resourceName: string){
  return applyDecorators(
    ApiOperation({
      summary: `Listar itens do ${resourceName} `,
      description: 'Listar todos os itens do carrinho de um cliente'
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: 200,
      type: GetCartSwaggerDtoResponse,
      description: 'Itens retornados com sucesso'
    }),
    ApiResponse({
      status: 401,
      description: `Token JWT inválido ou expirado`
    }),
    ApiResponse({
      status: 403,
      description: `Acesso negado, apenas para administradores`
    }),

  )
}
export function ApiCreateCartOperation(resourceName: string){
  return applyDecorators(
    ApiOperation({
      summary: `Adicionar produto no ${resourceName}`,
      description: "Adiciona um produto ao carrinho"
    }),
    ApiBearerAuth('JWT-auth'),
    ApiBody({
      type: CreateCartSwaggerDtoBody,
      description: 'Dados do produto a ser adicionado no carrinho'
    }),
    ApiResponse({
      status: 201,
      description: 'Item adicionado com sucesso',
      type: CreateCartSwaggerDtoResponse,
      example: {
          "id": 10,
          "cartId": "368ce346-e0d7-45fb-bd46-6d9cc25e0049",
          "productId": 4,
          "quantity": 2,
          "createdAt": "2025-09-28T19:28:03.225Z",
          "updatedAt": "2025-09-28T19:28:03.225Z"
        }
    }),
    ApiResponse({
      status: 404,
      description: `Produto não encontrado`
    }),
     ApiResponse({
      status: 401,
      description: `Token JWT inválido ou expirado`
    }),
  )
}