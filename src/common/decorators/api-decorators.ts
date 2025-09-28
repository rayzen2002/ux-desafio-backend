import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { CreateProductSwaggerDto, PaginatedProductsSwaggerDto, UpdateProductSwaggerDto } from "../../products/dto/product-example.dto";

export function ApiListOperation(resourceName: string) {
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
export function ApiCreateOperation(resourceName: string, bodyType?: any){
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
export function ApiUpdateOperation(resourceName: string, bodyType?: any) {
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
export function ApiDeleteOperation(resourceName: string) {
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