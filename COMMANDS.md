# 🚀 Comandos Úteis - Bot-PDV

## 📦 Instalação e Setup

```bash
# Instalar todas as dependências
npm install

# Iniciar containers Docker (PostgreSQL + Redis)
npm run docker:up

# Parar containers
npm run docker:down

# Gerar Prisma Client
npm run db:generate

# Executar migrations
npm run db:migrate

# Abrir Prisma Studio (GUI do banco)
npm run db:studio
```

---

## 🛠️ Desenvolvimento

```bash
# Iniciar todos os serviços
npm run dev

# Iniciar apenas a API
npm run dev:api

# Iniciar apenas o Frontend
npm run dev:web

# Iniciar apenas o Bot
npm run dev:bot
```

---

## 🏗️ Build

```bash
# Build de todos os projetos
npm run build

# Build apenas da API
npm run build:api

# Build apenas do Frontend
npm run build:web

# Build apenas do Bot
npm run build:bot
```

---

## 🧪 Testes e Qualidade

```bash
# Executar testes
npm run test

# Executar linter
npm run lint

# Limpar node_modules e builds
npm run clean
```

---

## 🗄️ Banco de Dados

```bash
# Criar uma nova migration
cd packages/database
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Visualizar banco de dados
npm run db:studio

# Gerar Prisma Client após mudanças no schema
npm run db:generate

# Seed do banco (se configurado)
npx prisma db seed
```

---

## 🚀 Deploy

```bash
# Usar o script de deploy
./deploy.sh

# Ou manualmente
git add .
git commit -m "mensagem"
git push origin main
```

---

## 🐛 Debug e Logs

```bash
# Ver logs da API (desenvolvimento)
cd apps/api
npm run start:dev

# Ver logs do Bot (desenvolvimento)
cd apps/bot
npm run dev

# Ver logs em produção (Railway)
# Use o dashboard: https://railway.app

# Ver logs em produção (Vercel)
# Use o dashboard: https://vercel.com
```

---

## 🔧 Utilitários

```bash
# Verificar versões
node --version
npm --version

# Verificar status do Git
git status

# Ver branches
git branch

# Criar nova branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main

# Atualizar do remoto
git pull origin main

# Ver histórico de commits
git log --oneline -10
```

---

## 🐳 Docker

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver containers rodando
docker ps

# Ver logs de um container
docker logs -f container_name

# Acessar shell de um container
docker exec -it container_name sh

# Remover volumes (CUIDADO! Apaga dados)
docker-compose down -v
```

---

## 📊 Monitoramento

```bash
# Verificar se a API está respondendo
curl http://localhost:3001/api

# Verificar se o Frontend está rodando
curl http://localhost:3000

# Testar conexão com PostgreSQL
docker exec -it botpdv-postgres psql -U postgres -d botpdv

# Testar conexão com Redis
docker exec -it botpdv-redis redis-cli
```

---

## 🔐 Segurança

```bash
# Gerar JWT Secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Gerar UUID
node -e "console.log(require('crypto').randomUUID())"

# Verificar dependências com vulnerabilidades
npm audit

# Corrigir vulnerabilidades automáticas
npm audit fix
```

---

## 📝 Git Workflow

```bash
# Fluxo completo de trabalho
git checkout -b feature/nova-funcionalidade
# ... fazer mudanças ...
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
# ... criar Pull Request no GitHub ...

# Após merge, atualizar main local
git checkout main
git pull origin main
git branch -d feature/nova-funcionalidade
```

---

## 🎯 Atalhos Rápidos

```bash
# Desenvolvimento completo (3 terminais)
# Terminal 1:
npm run dev:api

# Terminal 2:
npm run dev:web

# Terminal 3:
npm run dev:bot

# Ou use tmux/screen para múltiplos terminais
```

---

## 💡 Dicas

1. **Use aliases no seu shell:**

   ```bash
   alias dev-api="cd ~/Projetos/Python/Bot-PDV && npm run dev:api"
   alias dev-web="cd ~/Projetos/Python/Bot-PDV && npm run dev:web"
   alias dev-bot="cd ~/Projetos/Python/Bot-PDV && npm run dev:bot"
   ```

2. **Configure o VS Code:**
   - Instale extensões: Prisma, ESLint, Prettier
   - Use o debugger integrado

3. **Mantenha dependências atualizadas:**

   ```bash
   npm outdated
   npm update
   ```

4. **Use o Prisma Studio para visualizar dados:**
   ```bash
   npm run db:studio
   ```
