# Railway Deploy - Variáveis de Ambiente

## 🗄️ PostgreSQL (Railway Plugin)

```
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🔴 Redis (Railway Plugin)

```
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password
```

## 🔐 API Backend

```
NODE_ENV=production
PORT=3001
JWT_SECRET=seu_jwt_secret_aqui_minimo_32_caracteres
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

## 🤖 Bot Telegram

```
NODE_ENV=production
PORT=3002
TELEGRAM_BOT_TOKEN=seu_token_do_botfather
API_BASE_URL=https://seu-api-url.railway.app
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

## 🌐 Frontend Web

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://seu-api-url.railway.app/api
```

---

## 📋 Passos para Deploy no Railway

### 1. Criar Projeto no Railway

1. Acesse https://railway.app
2. Crie novo projeto
3. Conecte com GitHub

### 2. Adicionar Serviços

#### PostgreSQL

1. Clique em "New" → "Database" → "PostgreSQL"
2. Aguarde provisionamento
3. Copie a `DATABASE_URL`

#### Redis

1. Clique em "New" → "Database" → "Redis"
2. Aguarde provisionamento
3. Copie as credenciais

#### API Backend

1. Clique em "New" → "GitHub Repo"
2. Selecione o repositório
3. Root Directory: `apps/api`
4. Build Command: `npm run build:api`
5. Start Command: `npm run start:prod`
6. Adicione variáveis de ambiente acima

#### Bot Telegram

1. Clique em "New" → "GitHub Repo"
2. Selecione o repositório
3. Root Directory: `apps/bot`
4. Build Command: `npm run build:bot`
5. Start Command: `node dist/main.js`
6. Adicione variáveis de ambiente acima

#### Frontend Web (Opcional)

1. Clique em "New" → "GitHub Repo"
2. Selecione o repositório
3. Root Directory: `apps/web`
4. Build Command: `npm run build`
5. Start Command: `npm start`
6. Adicione variáveis de ambiente acima

### 3. Executar Migrations

No serviço da API, adicione um "Deploy Command":

```
npx prisma migrate deploy --schema=./packages/database/prisma/schema.prisma
```

### 4. Verificar Deploy

- API: https://seu-api-url.railway.app/api
- Bot: Verificar logs no Railway
- Web: https://seu-web-url.railway.app

---

## 🔧 Troubleshooting

### Erro de Build

- Verificar se todas as dependências estão no package.json
- Verificar se o Prisma Client foi gerado

### Erro de Conexão com Banco

- Verificar se DATABASE_URL está correta
- Verificar se PostgreSQL está rodando

### Bot não responde

- Verificar se TELEGRAM_BOT_TOKEN está correto
- Verificar se API_BASE_URL está acessível
- Verificar logs do serviço

### Migrations não aplicadas

- Executar manualmente: `npx prisma migrate deploy`
- Verificar se DATABASE_URL está acessível
