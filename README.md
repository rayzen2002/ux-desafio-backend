# API de Marketplace - UX Software

Esta é uma API de Marketplace desenvolvida para o desafio PS Desenvolvedor Back-End - 2025 da UX-Software.

## Tecnologias Utilizadas

*   **NestJS**: Framework progressivo Node.js para a construção de aplicações server-side eficientes e escaláveis.
*   **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript.
*   **Drizzle ORM**: ORM moderno e leve para TypeScript.
*   **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
*   **Redis**: Servidor de estrutura de dados em memória, usado para cache e mensagens.
*   **JWT (JSON Web Tokens)**: Para autenticação e autorização.
*   **Bcrypt**: Para hash de senhas.
*   **Docker Compose**: Para orquestração de serviços de banco de dados e cache.
*   **Zod**: Biblioteca de validação de esquemas TypeScript-first.
*   **ESLint**: Para manter a consistência do código.
*   **Jest**: Framework de testes.
*   **Swagger**: Documentação da API.

## Configuração do Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

*   Node.js (versão 18 ou superior)
*   npm (gerenciador de pacotes do Node.js)
*   Docker e Docker Compose

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`, e preencha as variáveis de ambiente necessárias. As variáveis mínimas esperadas são:

```
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your_jwt_secret"
```

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/rayzen2002/ux-desafio-backend]
    cd ux-desafio
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```

# Rodando o projeto(steps)
 ```
 npm install
 npm run start:dev
 ```

### Configuração dos Serviços (Docker Compose)

Certifique-se de que o Docker esteja em execução. Em seguida, inicie os serviços de banco de dados e Redis:

Este comando irá iniciar um contêiner PostgreSQL e um contêiner Redis.

```bash
npm run services:up
```

Esses comandos servem para pausar ou derrubar os serviços

```bash
npm run services:stop
npm run services:down
```


### Migrações do Banco de Dados

Após os serviços estarem em execução, execute as migrações do banco de dados para criar as tabelas necessárias:

```bash
npm run db:migrate 
```
Use esse comando para ter acesso ao banco de dados atráves da UI do drizzle studio
```bash
npm run db:studio 
```

### Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento (com *hot-reload*):

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000` (ou a porta configurada).

### Documentação

Documentação da API feita com Swagger dispinível em `http://localhost:3000/api/docs`


### Testes

Para executar os testes:

```bash
# Executar todos os testes
npm test
```
# Executar testes em modo watch
```
npm run test:watch
```



