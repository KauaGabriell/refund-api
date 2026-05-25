# Refund API

## Introdução

Projeto `refund-api` para gerenciamento simples de solicitações de reembolso. A API permite cadastrar usuários, autenticar sessões, controlar permissões por perfil, criar e consultar reembolsos, fazer upload de comprovantes e servir arquivos enviados.

Este é um projeto de estudo utilizado para praticar conceitos de backend com Node.js e TypeScript, incluindo construção de APIs REST com Express, validação com Zod, autenticação JWT, autorização por roles, criptografia de senhas, upload de arquivos com Multer, persistência com Prisma e PostgreSQL, migrations, paginação e tratamento centralizado de erros.

## Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- JWT
- Bcrypt
- Multer
- Biome
- Docker Compose

## Funcionalidades

- Cadastro de usuários com senha criptografada
- Login com JWT
- Autenticação via `Authorization: Bearer <token>`
- Autorização por perfil `employee` e `manager`
- Criação e listagem paginada de reembolsos
- Busca de reembolsos por nome do usuário
- Upload de imagens para comprovantes
- Tratamento centralizado de erros

## Requisitos

- Node.js 22+
- npm
- Docker e Docker Compose

## Configuração

Copie o arquivo `.env.example` para `.env` e ajuste os valores:

```env
PORT=1111

POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me
POSTGRES_DB=refund-api-postgres
DATABASE_URL="postgresql://postgres:change-me@localhost:5432/refund-api-postgres"

JWT_SECRET=change-me
```

> [!IMPORTANT]
> Use uma chave forte em `JWT_SECRET` fora do ambiente de estudo.

## Instalação

```bash
npm install
```

Suba o banco:

```bash
docker compose up -d
```

Rode as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Inicie a API:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:1111
```

## Scripts

```bash
npm run dev
```

Inicia o servidor em modo desenvolvimento com `tsx --watch`.

## Rotas

### Health

```http
GET /
```

Resposta:

```json
{
  "message": "API ONLINE"
}
```

### Usuários

```http
POST /users
```

Body:

```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "12345",
  "role": "employee"
}
```

`role` aceita:

```txt
employee | manager
```

### Sessões

```http
POST /sessions
```

Body:

```json
{
  "email": "user@example.com",
  "password": "12345"
}
```

Resposta:

```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "User",
    "email": "user@example.com",
    "role": "employee"
  }
}
```

### Reembolsos

Rotas protegidas. Envie:

```http
Authorization: Bearer <token>
```

Criar reembolso:

```http
POST /refunds
```

Perfil permitido: `employee`.

Body:

```json
{
  "name": "Curso de Marketing Digital",
  "amount": 249,
  "category": "others",
  "filename": "comprovante.png"
}
```

Listar reembolsos:

```http
GET /refunds?page=1&perPage=10&name=user
```

Perfil permitido: `manager`.

Buscar um reembolso:

```http
GET /refunds/:refundId
```

Perfis permitidos: `employee` e `manager`.

### Uploads

```http
POST /uploads
```

Perfil permitido: `employee`.

Envie o arquivo como `multipart/form-data` no campo:

```txt
file
```

Formatos aceitos:

```txt
image/jpeg
image/jpg
image/png
```

Tamanho máximo:

```txt
3MB
```

Os arquivos são salvos em:

```txt
tmp/uploads
```

## Estrutura

```txt
src/
  config/        Configurações de env, auth e upload
  controllers/   Controllers das rotas
  libs/          Integrações externas, como Prisma
  middlewares/   Autenticação, autorização e erros
  routes/        Definição das rotas
  types/         Extensões de tipos do Express
  utils/         Helpers e classes utilitárias
prisma/
  migrations/    Migrations do banco
  schema.prisma  Modelagem Prisma
```

## Banco de dados

Modelos principais:

- `User`
- `Refunds`

Enums:

- `UserRole`: `employee`, `manager`
- `Category`: `food`, `others`, `services`, `transport`, `accommodation`

## Observações

Este projeto é voltado para estudo. Ainda não possui suíte de testes automatizados.
