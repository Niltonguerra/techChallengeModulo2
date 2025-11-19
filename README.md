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
    - [Rodando local (desenvolvimento)](#rodando-local-desenvolvimento-1)
      - [Stack principal](#stack-principal)
      - [Pré-requisitos](#pré-requisitos)
      - [Rodando local (desenvolvimento)](#rodando-local-desenvolvimento-2)
- [Variáveis de ambiente](#variáveis-de-ambiente)
    - [Variáveis do backend:](#variáveis-do-backend)
    - [Variáveis de frontend:](#variáveis-de-frontend)
    - [Variáveis do mobile:](#variáveis-do-mobile)
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

### Rodando local (desenvolvimento)

#### Stack principal

Node 18 (recomendado)
pnpm
ESLint, Prettier, passport-jwt
Expo
React Native papers
Redux

#### Pré-requisitos
instalar e usar a versão correta do node:
``nvm install 20.19.2``
``nvm use 20.19.2``

instalar o pnpm:
``pnpm: npm i -g pnpm``

#### Rodando local (desenvolvimento)
1. Instale dependências:
``pnpm install``

2. rode o projeto:
``pnpm start``

3. após o projeto carregar preciose a tela 'a' para abrir o emulador com o projeto rodando.
---

# Variáveis de ambiente

### Variáveis do backend:

```env
AMBIENTE=PROD

DB_HOST_DEV=localhost
DB_PORT_DEV=5432
URL_SERVER_DEV=http://localhost:3000/
DB_DATABASE_DEV=nest_db
DB_USERNAME_DEV=nest_user
DB_PASSWORD_DEV=nest_password

DB_HOST_PROD=aws-1-sa-east-1.pooler.supabase.com
DB_PORT_PROD=5432
URL_SERVER_PROD=https://techchallengemodulo2.onrender.com/
DB_DATABASE_PROD=postgres
DB_USERNAME_PROD=postgres.lvonfxuhdykgviwqcmyw
DB_PASSWORD_PROD=VxoVH8ReYuqsB3N1

BCRYPT_SALT_ROUNDS=10
JWT_SECRET=educa_facil
SECRET_JWT_EMAIL=educa_facil
JWT_EMAIL_EXPIRES_IN=1h
JWT_EXPIRES_IN=24h
EMAIL_USER=no-reply@educafacil.space
EMAIL_PASSWORD=svjkqhfvifjqryde
RESEND_API_KEY=re_jU4zzHai_4Byi7bivUKWxSRckuNuxtGfT

SWAGGER_USER='admin'
SWAGGER_PASS='admin123'

FRONTEND_URL_LOCAL =http://localhost:5173
FRONTEND_URL_PROD =https://tech-challenge-modulo2-qcu447prv-niltonguerras-projects.vercel.app
FRONTEND_URL_PROFESSOR=https://tech-challenge-modulo2-zv8l-gmbfouuf6-niltonguerras-projects.vercel.app
FRONTEND_URL_MOBILE_LOCAL =http://localhost:8081
FRONTEND_URL_MOBILE_PROD =http://localhost:8081
```

### Variáveis de frontend:
```
VITE_URL_IMGBB=https://api.imgbb.com/1/upload
VITE_KEY_IMGBB=676c0bd4e17dba1ee3c06b04c599f085
VITE_API_URL=https://techchallengemodulo2.onrender.com
```

### Variáveis do mobile:
```
EXPO_ROUTER_APP_ROOT=app
EXPO_URL_IMGBB=https://api.imgbb.com/1/upload
EXPO_KEY_IMGBB=676c0bd4e17dba1ee3c06b04c599f085
# url nova com as atualizações implementadas contendo mais recursos que o backend de web
EXPO_API_URL=https://techchallengemodulo2-emdn.onrender.com
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
