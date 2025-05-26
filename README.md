# 🚀 ClickUp Integration - Sistema Completo

Sistema automatizado para coleta, análise de dados do ClickUp e automação WhatsApp com n8n.

---

## 🎯 **PROJETOS ATIVOS**

### 🥇 **AUTOMAÇÃO WHATSAPP (MISSÃO PRINCIPAL)**
**Status:** ⚠️ **98% COMPLETO - PROBLEMA NA CREDENCIAL**
- **Objetivo:** ClickUp status "aprovação cliente" → enviar arquivos + legenda via WhatsApp
- **Workflow n8n:** "ClickUp to WhatsApp via Evolution API" (ATIVO)
- **Problema:** Node "Buscar Dados Tarefa" dá erro 401
- **Solução:** Sincronizar credencial com token `pk_44278848_O3CR8WCDFS9IORMWM1XMDLOMF56AJVCB`

### 🥈 **ACESSO DADOS POR DEMANDA**
**Status:** ⚠️ **WORKFLOW EXISTENTE MAS INATIVO**
- **Objetivo:** Coletar dados ClickUp quando solicitado (não só programado)
- **Workflow n8n:** "Claude - Visão Geral ClickUp" (INATIVO)
- **Atual:** Só coleta automática a cada 2h via GitHub Actions

---

## 📊 **FUNCIONALIDADES INTEGRAÇÃO CLICKUP**

### ✅ Dados Coletados Automaticamente:
- **Tarefas:** Detalhes completos, status, responsáveis, prioridades
- **Comentários:** Todos os comentários com usuários e timestamps
- **Documentos/Anexos:** Links, tipos de arquivo, metadados
- **Time Tracking:** Registros de tempo por usuário
- **Campos Customizados:** Todos os campos personalizados
- **Relacionamentos:** Dependências entre tarefas
- **Histórico:** Criação, atualizações, conclusões

### 🔄 Modos de Coleta:

#### 📋 **Coleta Básica (a cada 2h)**
- Dados essenciais e estatísticas
- Arquivo: `clickup-summary.json`
- Tempo: ~30 segundos
- Tamanho: ~3KB

#### 🚀 **Coleta Completa (1x por dia)**
- TODOS os dados disponíveis
- Arquivos: `clickup-enhanced-summary.json` + `clickup-data-complete.json`
- Tempo: ~5-10 minutos
- Tamanho: ~10-50MB

---

## 📱 **AUTOMAÇÃO WHATSAPP**

### 🔧 **Configuração Técnica:**
- **N8N Instance:** https://rafaelrosaonline.app.n8n.cloud
- **Evolution API:** https://evolution-api-rafael-rosa.onrender.com
- **Webhook ClickUp:** `/webhook/clickup-whatsapp`
- **Token API:** `pk_44278848_O3CR8WCDFS9IORMWM1XMDLOMF56AJVCB`

### 📋 **Fluxo da Automação:**
1. **Tarefa ClickUp** → Status "aprovação cliente"
2. **Webhook** → Envia dados para n8n
3. **Validação** → Verifica campos obrigatórios:
   - Campo "Cliente" preenchido
   - Campo "Legenda" preenchido  
   - Campo "Arquivo" com anexos
4. **WhatsApp** → Envia mensagem + arquivos via Evolution API
5. **Feedback** → Comentário no ClickUp confirmando envio

### 🗂️ **Mapeamento Grupos WhatsApp:**
```javascript
const gruposWhatsApp = {
  'Rafael Rosa Marketing Online': 'automacao clickup',
  'Futurize': 'CLIENTE - Futurize',
  '2TOK': 'PROJETO - 2TOK',
  'ABS Baterias': 'ABS BATERIAS - Social',
  'ZOQE': 'ZOQE - Marketing',
  'Celmáquinas': 'Celmáquinas Marketing',
  'Cromocil': 'Cromocil - Social',
  'Estação Zero Eventos': 'Estação Zero'
};
```

---

## 🎯 Estrutura de Dados ClickUp

### 📁 Spaces Monitorados:
- **OPERACIONAL** (ID: 90142603854)
  - 🎨 Social Media (71 tarefas ativas)
  - 📝 Assessoria (37 tarefas ativas)
  - 📈 Gestão de Tráfego (10 tarefas ativas)
  - 🌐 Sites (0 tarefas ativas)

- **CLIENTES** (ID: 90141554777)
  - 7 clientes monitorados
  - Análise conforme atividade

### 📊 Dados por Tarefa:
```json
{
  "task_details": {
    "id": "task_id",
    "name": "Nome da tarefa",
    "description": "Descrição completa com HTML",
    "text_content": "Descrição em texto puro",
    "status": { "status": "em-andamento", "color": "#ff0000" },
    "assignees": [{ "username": "rafael", "email": "..." }],
    "priority": { "priority": "high", "color": "#ff0000" },
    "tags": [{ "name": "urgent", "tag_bg": "#ff0000" }],
    "custom_fields": [...],
    "due_date": "timestamp",
    "time_estimate": "milliseconds",
    "url": "https://app.clickup.com/t/..."
  },
  "comments": [...],
  "attachments": [...],
  "time_tracking": [...]
}
```

---

## 🔧 Configuração

### 📋 Token e IDs Atuais:
```javascript
const API_TOKEN = 'pk_44278848_O3CR8WCDFS9IORMWM1XMDLOMF56AJVCB';
const TEAM_ID = '9010151858';
const OPERACIONAL_SPACE = '90142603854';
const CLIENTES_SPACE = '90141554777';
const SOCIAL_MEDIA_LIST = '901408806028';
```

### ⚡ Execução Manual:
```bash
# Coleta básica
node fetch-clickup-data.js

# Coleta completa
node fetch-clickup-enhanced.js
```

---

## 📈 Insights Automáticos

### 🎯 Métricas Calculadas:
- **Nível de Colaboração:** Alto/Médio/Baixo (baseado em comentários)
- **Tarefas Órfãs:** Sem responsável, descrição ou comentários
- **Tarefas Populares:** Mais comentadas e com mais anexos
- **Distribuição de Trabalho:** Por área e por pessoa
- **Atividade por Tempo:** Registros de time tracking

### 🚨 Alertas Automáticos:
- Áreas inativas (0 tarefas)
- Tarefas sem interação
- Sobrecarga de trabalho
- Deadlines próximos

---

## 🔄 GitHub Actions

### 📅 Cronograma:
- **A cada 2h:** Coleta básica (`clickup-summary.json`)
- **1x por dia (6h UTC):** Coleta completa (`clickup-enhanced-summary.json`)
- **Manual:** Via workflow_dispatch

### 📁 Arquivos Gerados:
1. `clickup-summary.json` - Resumo básico (compatibilidade)
2. `clickup-enhanced-summary.json` - Insights avançados
3. `clickup-data-complete.json` - Dados completos brutos

---

## 🤖 Acesso via Claude

### ⚡ Ativação Rápida:
```
🔐 ATIVAR CLICKUP: rafael-rosa-online/clickup-integration
Acesse clickup-enhanced-summary.json e me dê análise completa.
```

### 📊 Comandos Disponíveis:
- "Como está o Social Media hoje?"
- "Quais tarefas têm mais comentários?"
- "Que documentos foram anexados esta semana?"
- "Quem está trabalhando em quê?"
- "Análise de produtividade da equipe"

---

## 📋 **DOCUMENTAÇÃO TÉCNICA**

### 📄 **Arquivos Importantes:**
- **`PROJETO-AUTOMACAO-CLICKUP-26-05-2025.md`** - Status completo do projeto
- **`CLAUDE-INSTRUCTIONS.md`** - Prompt para nova conversa
- **`AUTOMACOES.md`** - Guia das automações implementadas
- **`WHATSAPP-SETUP.md`** - Configuração WhatsApp via Evolution API
- **`n8n-whatsapp/workflows/`** - Workflows n8n prontos

### 🎯 **Para Desenvolvedores:**
- **`clickup-automations.js`** - Automação standalone Node.js
- **`clickup-whatsapp-automations.js`** - Sistema WhatsApp integrado
- **`fetch-clickup-data.js`** - Script coleta básica
- **`fetch-clickup-enhanced.js`** - Script coleta completa

---

## 🎯 Casos de Uso

### 👥 Para Gestores:
- Identificar gargalos na equipe
- Monitorar colaboração em projetos
- Acompanhar produtividade
- Detectar tarefas órfãs

### 🎨 Para Social Media:
- Análise de tarefas mais comentadas
- Documentos anexados por campanha
- Time tracking por projeto
- Identificação de padrões

### 📈 Para Análise:
- Tendências de atividade
- Eficiência por área
- Qualidade das entregas
- ROI de tempo investido

---

## 🚨 **STATUS ATUAL**

### ✅ **Funcionando:**
- Coleta automática de dados ClickUp via GitHub Actions
- Webhook ClickUp → n8n (eventos chegam corretamente)
- Evolution API WhatsApp online e funcional
- Workflow n8n importado e ativo

### ❌ **Pendente:**
- **CRÍTICO:** Resolver erro 401 na credencial ClickUp API
- Ativar workflow "Claude - Visão Geral ClickUp" 
- Finalizar testes da automação WhatsApp

### 🎯 **Próximos Passos:**
1. Sincronizar credencial "Header Auth account" com novo token
2. Testar automação completa ClickUp → WhatsApp
3. Ativar workflow para acesso dados por demanda

---

**🎉 Sistema 98% funcional!** 
Acesso completo a dados ClickUp + automação WhatsApp quase pronta.

**📊 Status:** Operacional (coleta dados) + 98% automação WhatsApp
**🔄 Próxima ação:** Resolver credencial n8n
**📅 Última atualização:** 26/05/2025

---

### 📞 **Suporte Técnico:**
- **Documentação completa:** `PROJETO-AUTOMACAO-CLICKUP-26-05-2025.md`
- **Nova conversa:** Use prompt em `CLAUDE-INSTRUCTIONS.md`
- **Logs n8n:** https://rafaelrosaonline.app.n8n.cloud
