# Refund API

API do sistema **Refund**, responsável por autenticação, autorização, cadastro de usuários, criação de solicitações de reembolso, upload de comprovantes e consulta paginada de reembolsos.

Este projeto funciona em conjunto com o frontend [`refund-frontend`](https://github.com/KauaGabriell/refund-frontend), já configurado para consumir a API em `http://localhost:1111`.

> [!NOTE]
> Este foi um projeto de estudo da Rocketseat. Aprender os conceitos de backend, autenticação, permissões por perfil, upload de arquivos, Prisma, validação e integração com o frontend foi difícil em vários momentos. Com prática, tentativa, erro e repetição, ficou mais claro como as partes se conectam. A ideia é continuar praticando para dominar melhor o conteúdo.

## Sobre

A API atende dois perfis principais:

- **Employee**: cria solicitações de reembolso e envia comprovantes.
- **Manager**: lista, filtra e visualiza solicitações de reembolso.

Ela foi criada para ser usada pelo frontend do projeto, mas também pode ser testada diretamente por ferramentas como Insomnia, Postman ou HTTP Client.

## Projeto relacionado

- [refund-frontend](https://github.com/KauaGabriell/refund-frontend)

> [!IMPORTANT]
> Execute esta API antes de iniciar o frontend. O frontend já está linkado com esta API usando `http://localhost:1111` em sua configuração do Axios.

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
- Docker Compose
- Biome

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Criptografia de senhas com Bcrypt
- Autenticação via `Authorization: Bearer <token>`
- Autorização por perfil `employee` e `manager`
- Criação de reembolsos
- Listagem paginada de reembolsos
- Busca de reembolsos por nome do usuário
- Consulta de detalhe de reembolso
- Upload de comprovantes
- Servir arquivos enviados via rota estática `/uploads`
- Validação de dados com Zod
- Tratamento centralizado de erros

## Requisitos

- Node.js
- npm
- Docker e Docker Compose

## Como executar API + frontend

### 1. Clone os dois repositórios

```bash
git clone https://github.com/KauaGabriell/refund-api.git
git clone https://github.com/KauaGabriell/refund-frontend.git
```

### 2. Configure e execute a API

Entre na pasta da API:

```bash
cd refund-api
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
PORT=1111

POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me
POSTGRES_DB=refund-api-postgres
DATABASE_URL="postgresql://postgres:change-me@localhost:5432/refund-api-postgres"

JWT_SECRET=change-me
```

> [!IMPORTANT]
> Troque `JWT_SECRET` por uma chave forte fora de ambiente de estudo.

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

### 3. Execute o frontend

Em outro terminal:

```bash
cd refund-frontend
npm install
npm run dev
```

O Vite exibirá a URL local do frontend, normalmente:

```txt
http://localhost:5173
```

Com os dois projetos rodando, o frontend já conseguirá autenticar usuários, enviar comprovantes, criar reembolsos e listar solicitações pela API.

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

Arquivos enviados são servidos por:

```txt
http://localhost:1111/uploads/<filename>
```

## Estrutura principal

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

Este projeto ainda é focado em estudo. A integração com o frontend foi uma parte importante do aprendizado, principalmente para entender autenticação, envio de token, upload com `multipart/form-data`, permissões e consumo de rotas protegidas.
