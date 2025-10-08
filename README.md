# README — Projeto Fullstack (Backend / Frontend / Mobile)

**Resumo:** instruções práticas para rodar, testar e desenvolver o backend (NestJS), frontend (React + Vite) e mobile. Vá direto ao ponto.

---

## Índice

- [README — Projeto Fullstack (Backend / Frontend / Mobile)](#readme--projeto-fullstack-backend--frontend--mobile)
  - [Índice](#índice)
- [Configuração do Backend](#configuração-do-backend)
    - [Rodando local (desenvolvimento)](#rodando-local-desenvolvimento)
    - [Testes](#testes)
    - [Formatação e lint](#formatação-e-lint)
    - [Gerar módulo / recurso (Nest)](#gerar-módulo--recurso-nest)
- [Configuração do Frontend](#configuração-do-frontend)
    - [Rodar local](#rodar-local)
    - [Lint / format / tipos](#lint--format--tipos)
- [Configuração do Mobile](#configuração-do-mobile)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Comandos úteis (resumo)](#comandos-úteis-resumo)
- [Estrutura do projeto (backend)](#estrutura-do-projeto-backend)
- [Credenciais](#credenciais)

---

# Configuração do Backend

**Stack principal**

* Node 18 (recomendado)
* pnpm
* NestJS (TypeScript)
* Docker / Docker Compose
* PostgreSQL + PgAdmin
* JWT, bcrypt, uuid
* Jest (testes)
* Swagger / Redoc (documentação)
* Resend (envio de e-mail)
* ESLint, Prettier, class-validator, passport-jwt

**Pré-requisitos**

* Node 18: `nvm install 18 && nvm use 18`
* Docker e Docker Compose
* pnpm: `npm i -g pnpm`

### Rodando local (desenvolvimento)

1. Instale dependências:

```bash
pnpm install
```

2. Suba DB e serviços:

```bash
docker compose -f docker/docker-compose.yml up -d
# ou para ambiente local apenas:
docker compose -f docker/docker-compose.local.yml up -d
```

3. Inicie o servidor Nest (watch):

```bash
pnpm run start:dev
```

4. Acessos:

* API: `http://localhost:3000`
* Swagger: `http://localhost:3000/swagger-ui`
* Docs (Redoc): `http://localhost:3000/docs`
* PgAdmin: `http://localhost:5050`

### Testes

* Rodar testes: `pnpm test`
* Coverage: `pnpm test:cov`
* Rodar teste específico (executar no diretório do teste): `pnpm test "nome-do-arquivo"`

### Formatação e lint

* Formatar com Prettier:

```bash
pnpm prettier --write "src/**/*.ts"
```

* ESLint:

```bash
pnpm run lint
pnpm run lint:fix
```

### Gerar módulo / recurso (Nest)

Gerar módulo + service + controller + pipe + decorator + guard + middleware + filter:

```bash
nome="nome_do_modulo" && \
nest generate module $nome && \
nest generate service $nome && \
nest generate controller $nome && \
nest generate pipe $nome && \
nest generate decorator $nome && \
nest generate guard $nome && \
nest generate middleware $nome && \
nest generate filter $nome
```

Gerar CRUD básico:

```bash
nest g resource nome_do_modulo
```

---

# Configuração do Frontend

**Stack**

* React 18 + TypeScript
* Vite
* React Router DOM
* Redux Toolkit
* ESLint, Prettier

### Rodar local

1. Instalar dependências:

```bash
npm install
```

2. Iniciar dev server:

```bash
npm run dev
```

3. Build / preview:

```bash
npm run build
npm run preview
```

### Lint / format / tipos

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run type-check
```

---

# Configuração do Mobile

>em desenvolvimento...
---

# Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`. `.env` com segredos reais.

Exemplo de variáveis:

```env
AMBIENTE=
DB_HOST_DEV=
DB_PORT_DEV=
DB_DATABASE_DEV=
DB_USERNAME_DEV=
DB_PASSWORD_DEV=
DB_HOST_PROD=
DB_PORT_PROD=
DB_DATABASE_PROD=
DB_USERNAME_PROD=
DB_PASSWORD_PROD=
URL_SERVER_DEV=
URL_SERVER_PROD=
BCRYPT_SALT_ROUNDS=
JWT_SECRET=
SECRET_JWT_EMAIL=
JWT_EMAIL_EXPIRES_IN=
JWT_EXPIRES_IN=
EMAIL_USER=
EMAIL_PASSWORD=
RESEND_API_KEY=
SWAGGER_USER=
SWAGGER_PASS=
FRONTEND_URL_LOCAL=
FRONTEND_URL_PROD=
FRONTEND_URL_PROFESSOR=
```

---

# Comandos úteis (resumo)

* Subir tudo (produção/dev):

```bash
docker compose -f docker/docker-compose.yml up -d
```

* Subir local (apenas serviços locais):

```bash
docker compose -f docker/docker-compose.local.yml up -d
```

* Rodar servidor Nest em dev:

```bash
pnpm run start:dev
```

* Ver logs do container Nest:

```bash
docker logs -f nest_api
```

* Prettier:

```bash
pnpm prettier --write "src/**/*.ts"
```

* Testes:

```bash
pnpm test
pnpm test:cov
```

---

# Estrutura do projeto (backend)

```
src/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── auth.module.ts
│   ├── post/
│   │   ├── controller/
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── service/
│   │   └── usecases/
│   ├── user/
│   ├── email/
│   └── common/
├── config/
├── docs/
├── app.module.ts
└── main.ts
```

---

# Credenciais 

**PostgreSQL**

* Usuário: `nest_user`
* Senha: `nest_password`

**PgAdmin**

* E-mail: `admin@admin.com`
* Senha: `admin`

**Swagger / Docs**

* Usuário: `admin`
* Senha: `admin123`

**Conta Google**

* Email: `educacaofacilfiap@gmail.com`
* Senha: `4c5WG1gW8hxC`
