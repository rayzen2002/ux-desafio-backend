import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ux-desafio')
    .setDescription(`

## 📚 Sobre a API

Sistema completo de gerenciamento de e-commerce com autenticação JWT e CRUD completo.

### ✨ Funcionalidades

✅ **Autenticação JWT** - Sistema seguro de login  
✅ **CRUD de Produtos** - Gerenciamento completo do catálogo  
✅ **Controle de Usuários** - Administração de usuários  
✅ **Carrinho de Compras** - Gestão de pedidos  
✅ **Paginação e Filtros** - Buscas avançadas  

### 🔐 Autenticação

Utilize \`Bearer Token\` no header Authorization:

\`\`\`http
Authorization: Bearer seu-jwt-token-aqui
\`\`\`

### 🚀 Endpoints Principais

| Módulo | Rota | Descrição |
|--------|------|-----------|
| **Auth** | \`POST /auth/login\` | Autenticação de usuários |
| **Products** | \`GET /products\` | Listagem de produtos |
| **Products** | \`POST /products\` | Criar produto (admin) |
| **Users** | \`GET /users\` | Gerenciar usuários |
| **Cart** | \`GET /cart\` | Gerenciar carrinho |

### 🏷️ Tags da API

- **auth** - Operações de autenticação
- **products** - Gerenciamento de produtos  
- **users** - Administração de usuários
- **cart** - Carrinho de compras

### 📋 Códigos de Resposta

| Status | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 500 | Erro interno |

---
*Documentação gerada automaticamente - Versão 1.0*
`
    
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT-auth'
    )
    .addTag('autenticação', 'Operações de autenticação')
    .addTag('produtos', 'Gerenciamento de produtos')
    .addTag('usuários', 'Gerenciamento de usuários')
    .addTag('carrinho', 'Gerenciamento do carrinho de compras')
    .setContact('Emanuel Magalhães', 'https://github.com/rayzen2002', 'emanuelzsmj@gmail.com')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api/docs', app, documentFactory, {
    customSiteTitle: 'API Documentation',
    customCss: `
      .topbar { background-color: #2c3e50; }
      .swagger-ui .info h1 { color: #2c3e50; }
    `,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      authAction: {
        'JWT-auth': {
          name: 'JWT-auth',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Bearer token'
          },
          value: 'Bearer <your_token_here>'
        }
      },
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
