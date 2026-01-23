---
description: Como fazer deploy das atualizações no Railway e Vercel
---

# 🚀 Deploy Bot-PDV - Railway & Vercel

Este workflow descreve como fazer deploy das atualizações do Bot-PDV nos ambientes de produção.

## 📋 Pré-requisitos

- Código commitado e pushed para o GitHub
- Contas configuradas no Railway e Vercel
- Variáveis de ambiente configuradas

---

## 🔴 Deploy Backend (Railway)

O Railway está configurado para **deploy automático** quando você faz push para o GitHub.

### Serviços no Railway:

1. **PostgreSQL** (Database)
2. **Redis** (Cache)
3. **API Backend** (`apps/api`)
4. **Bot Telegram** (`apps/bot`)

### Como fazer deploy:

```bash
# 1. Certifique-se de que suas mudanças estão commitadas
git status

# 2. Commit suas mudanças (se necessário)
git add .
git commit -m "feat: descrição da atualização"

# 3. Push para o GitHub
git push origin main
```

**O Railway detectará automaticamente o push e iniciará o deploy!**

### Verificar o deploy:

1. Acesse https://railway.app
2. Selecione seu projeto "Bot-PDV"
3. Verifique os logs de cada serviço:
   - API Backend
   - Bot Telegram
4. Aguarde até ver "Deployment successful" ✅

### Se houver mudanças no banco de dados:

As migrations do Prisma são executadas automaticamente no deploy da API através do script `postinstall`.

Se precisar executar manualmente:

1. Acesse o serviço da API no Railway
2. Vá em "Settings" → "Deploy"
3. Execute: `npx prisma migrate deploy --schema=../../packages/database/prisma/schema.prisma`

---

## 🔵 Deploy Frontend (Vercel)

O Vercel também está configurado para **deploy automático** quando você faz push para o GitHub.

### Como fazer deploy:

```bash
# O mesmo processo do Railway!
# Apenas faça push para o GitHub:
git push origin main
```

**O Vercel detectará automaticamente e iniciará o deploy!**

### Verificar o deploy:

1. Acesse https://vercel.com
2. Selecione seu projeto
3. Verifique o status do deployment
4. Acesse a URL de produção para testar

### Configuração importante:

Certifique-se de que as variáveis de ambiente estão configuradas no Vercel:

- `NEXT_PUBLIC_API_URL` - URL da API no Railway
- Outras variáveis necessárias

---

## 🔄 Fluxo Completo de Deploy

```bash
# 1. Desenvolva localmente
npm run dev:api    # Teste a API
npm run dev:web    # Teste o frontend
npm run dev:bot    # Teste o bot

# 2. Commit suas mudanças
git add .
git commit -m "feat: nova funcionalidade"

# 3. Push para o GitHub
git push origin main

# 4. Aguarde os deploys automáticos
# - Railway: ~2-5 minutos
# - Vercel: ~1-3 minutos

# 5. Verifique os serviços em produção
# - API: https://seu-api-url.railway.app/api
# - Web: https://seu-projeto.vercel.app
# - Bot: Teste enviando mensagem no Telegram
```

---

## 🐛 Troubleshooting

### Deploy falhou no Railway

1. Verifique os logs do serviço que falhou
2. Problemas comuns:
   - Erro de build: verifique dependências no `package.json`
   - Erro de conexão: verifique variáveis de ambiente
   - Erro de migration: execute manualmente

### Deploy falhou no Vercel

1. Verifique os logs de build
2. Problemas comuns:
   - Erro de build: verifique `next.config.js`
   - Variáveis de ambiente faltando
   - Dependências não instaladas

### Como fazer rollback

**Railway:**

1. Acesse o serviço
2. Vá em "Deployments"
3. Clique em um deployment anterior
4. Clique em "Redeploy"

**Vercel:**

1. Acesse o projeto
2. Vá em "Deployments"
3. Encontre o deployment anterior
4. Clique nos três pontos → "Promote to Production"

---

## 📊 Monitoramento

Após o deploy, verifique:

- ✅ API respondendo corretamente
- ✅ Frontend carregando
- ✅ Bot respondendo no Telegram
- ✅ Banco de dados acessível
- ✅ Redis funcionando
- ✅ Logs sem erros críticos

---

## 🔐 Variáveis de Ambiente

### Railway - API Backend

```
NODE_ENV=production
PORT=3001
JWT_SECRET=seu_jwt_secret_aqui
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Railway - Bot Telegram

```
NODE_ENV=production
PORT=3002
TELEGRAM_BOT_TOKEN=seu_token
API_BASE_URL=https://seu-api-url.railway.app
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Vercel - Frontend

```
NEXT_PUBLIC_API_URL=https://seu-api-url.railway.app/api
```

---

## 💡 Dicas

1. **Sempre teste localmente antes de fazer deploy**
2. **Use commits descritivos** para facilitar o rastreamento
3. **Monitore os logs** após cada deploy
4. **Configure notificações** no Railway e Vercel para ser alertado sobre falhas
5. **Mantenha as variáveis de ambiente atualizadas** em ambas as plataformas
