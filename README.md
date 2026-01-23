# 🤖 PDV-DataBot

Sistema SaaS completo de Bot Telegram + PDV para pequenos negócios.

## 🚀 Stack Tecnológica

- **Backend:** NestJS + TypeScript + Prisma
- **Frontend:** Next.js 14 + TailwindCSS + shadcn/ui
- **Bot:** Telegram (Telegraf)
- **Database:** PostgreSQL + Redis
- **Monorepo:** Turborepo

## 📦 Estrutura

```
pdv-databot/
├── apps/
│   ├── api/          # Backend NestJS
│   ├── bot/          # Serviço Telegram Bot
│   └── web/          # Dashboard Next.js
├── packages/
│   ├── database/     # Prisma schema
│   └── types/        # TypeScript types
└── docker-compose.yml
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar banco de dados
npm run docker:up

# Executar migrations
npm run db:migrate

# Iniciar serviços
npm run dev:api    # API em http://localhost:3001
npm run dev:bot    # Bot Telegram
npm run dev:web    # Dashboard em http://localhost:3000
```

📚 **Mais comandos:** Veja [`COMMANDS.md`](COMMANDS.md)

## 🚀 Deploy

### Deploy Automático

O projeto está configurado para **deploy automático**:

- **Backend (Railway):** API + Bot Telegram
- **Frontend (Vercel):** Dashboard Web

### Como fazer deploy

```bash
# Opção 1: Usar o script de deploy
./deploy.sh

# Opção 2: Manual
git add .
git commit -m "sua mensagem"
git push origin main
```

Os deploys acontecem automaticamente quando você faz push para o GitHub!

### Documentação Completa

Para configuração inicial e troubleshooting, veja:

- **Workflow de Deploy:** `.agent/workflows/deploy.md`
- **Guia Detalhado:** Veja os artifacts da conversa

### Serviços em Produção

- **Railway:** API Backend + Bot Telegram + PostgreSQL + Redis
- **Vercel:** Frontend Web (Next.js)

---

## 📚 Documentação

- **[Guia de Deploy](DEPLOY_QUICK.md)** - Referência rápida para deploy
- **[Variáveis de Ambiente](ENV_VARIABLES.md)** - Configuração completa de variáveis
- **[Comandos Úteis](COMMANDS.md)** - Referência de comandos do projeto
- **[Workflow de Deploy](.agent/workflows/deploy.md)** - Processo detalhado de deploy
- **[Setup Railway](RAILWAY_DEPLOY.md)** - Configuração inicial do Railway

## 📝 Licença

MIT
