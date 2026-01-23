# Variáveis de Ambiente - Bot-PDV

## 📋 Checklist de Configuração

Use este arquivo como referência para configurar as variáveis de ambiente em cada plataforma.

---

## 🔴 Railway - PostgreSQL

Criado automaticamente pelo Railway Plugin.

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## 🔴 Railway - Redis

Criado automaticamente pelo Railway Plugin.

```env
REDIS_HOST=redis.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=sua_senha_redis
```

---

## 🔴 Railway - API Backend

### Variáveis Obrigatórias

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=seu_jwt_secret_aqui_minimo_32_caracteres_muito_seguro
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Como Configurar

1. Acesse o serviço da API no Railway
2. Vá em **Variables**
3. Adicione cada variável
4. Para `DATABASE_URL`, use a referência: `${{Postgres.DATABASE_URL}}`

> **Importante:** O `JWT_SECRET` deve ter no mínimo 32 caracteres e ser único!

---

## 🔴 Railway - Bot Telegram

### Variáveis Obrigatórias

```env
NODE_ENV=production
PORT=3002
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
API_BASE_URL=https://seu-api-url.railway.app
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Como Obter o Token do Telegram

1. Abra o Telegram
2. Procure por `@BotFather`
3. Envie `/newbot` ou use um bot existente
4. Copie o token fornecido

### Como Configurar

1. Acesse o serviço do Bot no Railway
2. Vá em **Variables**
3. Adicione cada variável
4. Para `API_BASE_URL`, use a URL pública da sua API
5. Use as referências `${{...}}` para Redis e Postgres

---

## 🔵 Vercel - Frontend Web

### Variáveis Obrigatórias

```env
NEXT_PUBLIC_API_URL=https://seu-api-url.railway.app/api
```

### Como Configurar

1. Acesse o projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione a variável
4. Selecione os ambientes: **Production**, **Preview**, **Development**
5. Salve

> **Atenção:** A URL deve terminar com `/api` e deve ser a URL pública da sua API no Railway!

---

## 🔒 Segurança

### ⚠️ Nunca commite variáveis de ambiente!

O arquivo `.env` está no `.gitignore` e **nunca** deve ser commitado.

### ✅ Boas Práticas

1. **JWT_SECRET:** Use um gerador de senhas forte

   ```bash
   # Gerar um secret seguro
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Tokens:** Nunca compartilhe tokens do Telegram ou outros secrets

3. **URLs:** Use HTTPS em produção

4. **Backup:** Guarde as variáveis em um gerenciador de senhas

---

## 🧪 Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/botpdv

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=

# API
NODE_ENV=development
PORT=3001
JWT_SECRET=desenvolvimento_secret_minimo_32_caracteres_aqui

# Bot
TELEGRAM_BOT_TOKEN=seu_token_de_desenvolvimento
API_BASE_URL=http://localhost:3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📝 Template para Copiar

### Railway API

```
NODE_ENV=production
PORT=3001
JWT_SECRET=
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Railway Bot

```
NODE_ENV=production
PORT=3002
TELEGRAM_BOT_TOKEN=
API_BASE_URL=
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Vercel Frontend

```
NEXT_PUBLIC_API_URL=
```

---

## ✅ Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] Todas as variáveis estão configuradas
- [ ] `JWT_SECRET` tem no mínimo 32 caracteres
- [ ] `TELEGRAM_BOT_TOKEN` está correto
- [ ] `API_BASE_URL` aponta para a URL correta
- [ ] `NEXT_PUBLIC_API_URL` aponta para a URL correta
- [ ] Referências `${{...}}` estão corretas no Railway
- [ ] Variáveis não estão commitadas no Git

---

## 🔧 Troubleshooting

### Erro: "JWT_SECRET must be at least 32 characters"

Gere um novo secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Erro: "Cannot connect to database"

Verifique se `DATABASE_URL` está configurada corretamente com a referência `${{Postgres.DATABASE_URL}}`

### Erro: "Bot token is invalid"

1. Verifique se copiou o token completo do BotFather
2. Não deve ter espaços antes ou depois
3. Formato: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Frontend não conecta com API

1. Verifique se `NEXT_PUBLIC_API_URL` está correto
2. Deve incluir `/api` no final
3. Deve usar HTTPS em produção
4. Teste a URL no browser primeiro
