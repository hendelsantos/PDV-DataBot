# 🚀 Deploy Rápido - Bot-PDV

## TL;DR - Como fazer deploy

```bash
# 1. Commit suas mudanças
git add .
git commit -m "sua mensagem"

# 2. Push para GitHub
git push origin main

# 3. Pronto! ✅
# Railway e Vercel fazem deploy automático
```

---

## ⚡ Usando o Script de Deploy

```bash
./deploy.sh
```

O script vai:

1. ✅ Verificar mudanças não commitadas
2. ✅ Ajudar você a commitar (se necessário)
3. ✅ Fazer push para o GitHub
4. ✅ Mostrar informações sobre o deploy

---

## 🔍 Verificar Status do Deploy

### Railway (Backend)

1. Acesse: https://railway.app
2. Selecione o projeto "Bot-PDV"
3. Veja os logs de cada serviço

### Vercel (Frontend)

1. Acesse: https://vercel.com
2. Selecione o projeto
3. Veja o status do deployment

---

## 🐛 Problemas Comuns

### Deploy falhou?

**Railway:**

```bash
# Verifique os logs no dashboard
# Problemas comuns:
# - Dependências faltando → adicione no package.json
# - Erro de migration → execute manualmente
# - Variáveis de ambiente → verifique configuração
```

**Vercel:**

```bash
# Verifique os logs de build
# Problemas comuns:
# - Erro de build → teste localmente: npm run build
# - Variáveis faltando → adicione no dashboard
```

### Bot não responde?

1. ✅ Verifique `TELEGRAM_BOT_TOKEN`
2. ✅ Verifique `API_BASE_URL`
3. ✅ Veja os logs do bot no Railway
4. ✅ Teste a API: `curl https://seu-api-url.railway.app/api`

### Frontend não conecta?

1. ✅ Verifique `NEXT_PUBLIC_API_URL`
2. ✅ Teste a API no browser
3. ✅ Veja o console (F12)
4. ✅ Verifique CORS na API

---

## 📚 Documentação Completa

- **Workflow:** `.agent/workflows/deploy.md`
- **Guia Detalhado:** Veja os artifacts
- **Railway Setup:** `RAILWAY_DEPLOY.md`

---

## 🎯 Checklist Pós-Deploy

- [ ] API respondendo: `https://seu-api-url.railway.app/api`
- [ ] Frontend carregando: `https://seu-projeto.vercel.app`
- [ ] Bot respondendo no Telegram
- [ ] Logs sem erros críticos
- [ ] Banco de dados acessível

---

**Dica:** Configure notificações no Railway e Vercel para ser alertado sobre deploys!
