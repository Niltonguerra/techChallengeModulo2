# 🚀 Configuração do Ambiente Docker para NestJS

Este projeto utiliza Docker e Docker Compose para gerenciar os contêineres do banco de dados, servidor e pgAdmin.

## 🏗 Comandos para iniciar os serviços
### 📦 Rodar o banco de dados
Inicie apenas o PostgreSQL e pgAdmin:
``docker-compose -f docker-compose.db.yml up -d``


### 🖥 Rodar o servidor + banco
Inicie o NestJS junto com o banco de dados:
``docker-compose -f docker-compose.app.yml -f docker-compose.db.yml up -d``


### 📜 Ver logs do NestJS
Para visualizar os logs da aplicação:
``docker logs -f nest_api``



### 🌐 Acessos
- 🔗 pgAdmin: [http://localhost:5050/](http://localhost:5050/)
- 🔗 Postman: [https://app.getpostman.com/join-team?invite_code=58f4c15f967d63612f4e9e18bb98f0bad8747a2e80c920a529e1089b2d0214be](https://app.getpostman.com/join-team?invite_code=58f4c15f967d63612f4e9e18bb98f0bad8747a2e80c920a529e1089b2d0214be)

### 🔧 Ferramentas de Desenvolvimento
🛠 Rodar Prettier para formatar código
``pnpm prettier --write "src/**/*.ts"``



### 🔑 Credenciais de acesso

#### 🏦 Banco de Dados (PostgreSQL)
- Usuário: nest_user
- Senha: nest_password

#### 🖥 pgAdmin
- E-mail: admin@admin.com
- Senha: admin


