#!/bin/bash

# 🚀 Script de Deploy Bot-PDV
# Facilita o processo de deploy para Railway e Vercel

set -e  # Sair se houver erro

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Bot-PDV Deploy Script${NC}"
echo ""

# Verificar se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Você tem mudanças não commitadas:${NC}"
    git status -s
    echo ""
    read -p "Deseja commitar essas mudanças? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        read -p "Digite a mensagem do commit: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Mudanças commitadas${NC}"
    else
        echo -e "${RED}❌ Deploy cancelado. Commit suas mudanças primeiro.${NC}"
        exit 1
    fi
fi

# Verificar branch atual
current_branch=$(git branch --show-current)
echo -e "${BLUE}📍 Branch atual: ${current_branch}${NC}"

if [[ "$current_branch" != "main" ]]; then
    echo -e "${YELLOW}⚠️  Você não está na branch main${NC}"
    read -p "Deseja continuar mesmo assim? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${RED}❌ Deploy cancelado${NC}"
        exit 1
    fi
fi

# Push para GitHub
echo ""
echo -e "${BLUE}📤 Fazendo push para GitHub...${NC}"
git push origin $current_branch

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    exit 1
fi

# Informações sobre os deploys
echo ""
echo -e "${GREEN}🎉 Deploy iniciado!${NC}"
echo ""
echo -e "${BLUE}Os deploys automáticos foram acionados:${NC}"
echo ""
echo -e "  🔴 ${YELLOW}Railway${NC} (Backend + Bot)"
echo -e "     • API Backend: ~2-5 minutos"
echo -e "     • Bot Telegram: ~2-5 minutos"
echo ""
echo -e "  🔵 ${YELLOW}Vercel${NC} (Frontend)"
echo -e "     • Web App: ~1-3 minutos"
echo ""
echo -e "${BLUE}📊 Acompanhe o progresso:${NC}"
echo -e "  • Railway: ${YELLOW}https://railway.app${NC}"
echo -e "  • Vercel: ${YELLOW}https://vercel.com${NC}"
echo ""
echo -e "${GREEN}✨ Aguarde alguns minutos e verifique os serviços!${NC}"
