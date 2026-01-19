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

## 🚀 Deploy

O projeto está configurado para deploy no Railway com 3 serviços:

- API Backend
- Bot Telegram
- Frontend Web

## 📝 Licença

MIT
