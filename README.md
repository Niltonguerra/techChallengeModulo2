# 🚀 Configuração do Ambiente Docker para NestJS

Este projeto utiliza Docker e Docker Compose para gerenciar os contêineres do banco de dados, servidor e pgAdmin.

## 🏗 comandos uteis:
🏗 comando para rodar os serviços localmente:<br>
``docker compose -f docker/docker-compose.local.yml up -d``

🏗 comando para rodar o banco e o pgadmin:<br>
``docker compose -f docker/docker-compose.db.yml up -d``

🏗 comando para rodar o projeto inteiro:<br>
``docker compose -f docker/docker-compose.yml up -d``

🏗 comando para rodar o servidor local:<br>
``pnpm run start:dev``

📜 Ver logs do NestJS:<br>
``docker logs -f nest_api``

## 🌐 Acessos
- 🔗 pgAdmin: [http://localhost:5050/](http://localhost:5050/)
- 🔗 Postman: [https://app.getpostman.com/join-team?invite_code=58f4c15f967d63612f4e9e18bb98f0bad8747a2e80c920a529e1089b2d0214be](https://app.getpostman.com/join-team?invite_code=58f4c15f967d63612f4e9e18bb98f0bad8747a2e80c920a529e1089b2d0214be)

## 🔧 Ferramentas de Desenvolvimento
🛠 Rodar Prettier para formatar código:<br>
``pnpm prettier --write "src/**/*.ts"``

### 🔧 realizar teste testes
🛠 Comando para rodar os testes localmente:
``pnpm test``

🛠 Comando para rodar o covarage:
``pnpm test:cov``

🛠 Comando para o teste apenas para um arquivo (para essse comando funcionar deve se estar no diretório do teste):
``pnpm test "nome-do-arquivo"``


## informações sobre o projeto:

- versão do node: 18
- é importante sempre que for rodar local mudar a variavel de ambiente chamada `AMBIENTE` para `DEV` quando for rodar local e mudar para `PROD` quando for subir para o servidor
### 🔑 Credenciais de acesso

#### 🏦 Banco de Dados (PostgreSQL)
- Usuário: nest_user
- Senha: nest_password

#### 🖥 pgAdmin
- E-mail: admin@admin.com
- Senha: admin 

## Comandos utilitarios:
comando para criar um modulo em nest com todas as dependências:

``nome="nome do modulo" && nest generate module $nome && nest generate service $nome && nest generate controller $nome && nest generate pipe $nome && nest generate decorator $nome && nest generate guard $nome && nest generate middleware $nome && nest generate filter $nome ``

- substitua o nome do modulo pelo nome do modulo que você quer criar, por exemplo:
`nome="materias" && nest generate module $nome && nest generate service $nome && nest generate controller $nome && nest generate pipe $nome && nest generate decorator $nome && nest generate guard $nome && nest generate middleware $nome && nest generate filter $nome`

- comando para criar um modulo com um CRUD basico:
``nest g resource "nome do modulo a ser criado"``


envs(sei que é errado deixar aqui, mas é para simplificar nossa vida):
AMBIENTE=dev
DB_HOST_DEV=localhost
DB_HOST_PROD=db
DB_PORT=5432
DB_USERNAME=nest_user
DB_PASSWORD=nest_password
DB_DATABASE=nest_db