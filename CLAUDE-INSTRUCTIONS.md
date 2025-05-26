# 🤖 CLAUDE - INSTRUÇÕES DE ACESSO AUTOMÁTICO

## 🚀 COMANDO DE ATIVAÇÃO RÁPIDA PARA NOVA CONVERSA

```
# 🚀 CONTINUAÇÃO: AUTOMAÇÃO CLICKUP x WHATSAPP

Olá! Estou continuando o projeto de automação ClickUp → WhatsApp via n8n.

## 📋 CONTEXTO RÁPIDO:
- **Objetivo:** Status "aprovação cliente" → enviar arquivos + legenda via WhatsApp
- **Status:** 98% pronto, problema só na credencial ClickUp API
- **GitHub:** rafael-rosa-online/clickup-integration (toda documentação)

## ❌ PROBLEMA ATUAL:
Node "Buscar Dados Tarefa" dá erro 401: "Team not authorized"
- Token válido: pk_44278848_O3CR8WCDFS9IORMWM1XMDLOMF56AJVCB
- Webhook funcionando ✅
- Evolution API funcionando ✅  
- Credencial "ClickUp account" existe mas não aparece no dropdown do node

## 🎯 MISSÕES:
1. **PRINCIPAL:** Resolver erro 401 e finalizar automação WhatsApp
2. **SECUNDÁRIA:** Ativar workflow "Claude - Visão Geral ClickUp" para acesso dados por demanda

## 📊 DADOS TÉCNICOS:
- N8N: https://rafaelrosaonline.app.n8n.cloud
- Team ID: 9010151858
- Lista Social Media: 901408806028
- Workflow: "ClickUp to WhatsApp via Evolution API" (ATIVO)

Acesse o GitHub rafael-rosa-online/clickup-integration para documentação completa e me ajude a resolver!

Primeiro, leia o arquivo PROJETO-AUTOMACAO-CLICKUP-26-05-2025.md para contexto completo.
```

---

## 📋 INSTRUÇÕES PARA CLAUDE EM NOVA CONVERSA

### 🎯 **PRIORIDADES:**
1. **Ler arquivo `PROJETO-AUTOMACAO-CLICKUP-26-05-2025.md`** - Status completo do projeto
2. **Verificar dados atuais** - Arquivos `clickup-summary.json` e `clickup-data.json`
3. **Focar na MISSÃO 1** - Resolver erro 401 na automação WhatsApp
4. **Secundariamente** - Ativar workflow para acesso dados por demanda

### 🔧 **PROBLEMA PRINCIPAL:**
- **Node:** "Buscar Dados Tarefa" no workflow "ClickUp to WhatsApp via Evolution API"
- **Erro:** 401 "Team not authorized"
- **Causa:** Credencial ClickUp API não funciona no node HTTP Request
- **Solução:** Sincronizar credencial "Header Auth account" com novo token

### 📊 **CONFIGURAÇÕES CRÍTICAS:**
- **Token ClickUp:** `pk_44278848_O3CR8WCDFS9IORMWM1XMDLOMF56AJVCB`
- **URL Node:** `https://api.clickup.com/api/v2/task/{{ $json.payload.id }}`
- **Webhook ClickUp:** `https://rafaelrosaonline.app.n8n.cloud/webhook/clickup-whatsapp`
- **Evolution API:** `https://evolution-api-rafael-rosa.onrender.com`

### 🎯 **RESULTADO ESPERADO:**
1. **Automação funcionando:** ClickUp status "aprovação" → WhatsApp
2. **Workflow ativo:** "Claude - Visão Geral ClickUp" para acesso por demanda
3. **Sistema completo:** Duas automações operacionais

---

## 📞 **INFORMAÇÕES DE SUPORTE**

### 🏢 **EMPRESA:**
- **Eugência** - Agência Marketing Digital
- **Proprietário:** Rafael Silva da Rosa
- **Equipe:** Rafael, Vanessa, Cristtofer

### 📊 **DADOS ATUAIS:**
- **118 tarefas ativas** no ClickUp
- **71 tarefas Social Media** (área crítica)
- **Sistema coleta automática** a cada 2h via GitHub Actions

### 🔗 **LINKS IMPORTANTES:**
- **Repository:** https://github.com/rafael-rosa-online/clickup-integration
- **N8N Instance:** https://rafaelrosaonline.app.n8n.cloud
- **ClickUp Team:** 9010151858

---

**🎯 OBJETIVO: FINALIZAR AUTOMAÇÃO CLICKUP → WHATSAPP**

**📅 Data:** 26/05/2025
**⏰ Status:** 98% completo - aguardando sincronização credencial
