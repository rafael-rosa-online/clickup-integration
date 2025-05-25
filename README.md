# 🔗 ClickUp Integration

Integração automática do ClickUp para fornecer dados atualizados ao Claude via GitHub Actions.

## 🚀 Funcionamento

Este repositório contém:

- **Script Node.js** que busca dados do ClickUp via API
- **GitHub Action** que executa automaticamente a cada 2 horas
- **Arquivo JSON** com dados sempre atualizados

## 📊 Dados Coletados

- **Listas do Space OPERACIONAL** (Social Media, Sites, Assessoria, Gestão de Tráfego)
- **Listas do Space CLIENTES** (todos os clientes)
- **Tarefas recentes** das listas mais ativas
- **Estatísticas** consolidadas

## ⏰ Atualização Automática

- **A cada 2 horas** via GitHub Actions
- **Push para main** trigga atualização imediata
- **Execução manual** disponível no GitHub

## 🔍 Acesso aos Dados

Os dados ficam disponíveis em:
```
https://raw.githubusercontent.com/rafael-rosa-online/clickup-integration/main/clickup-data.json
```

## 📁 Estrutura dos Dados

```json
{
  "timestamp": "2025-05-25T21:30:00.000Z",
  "last_updated": "25/05/2025 18:30:00",
  "operacional": { ... },
  "clientes": { ... },
  "atividade_recente": { ... },
  "resumo_geral": { ... },
  "gestao_trafego": { ... },
  "stats": {
    "total_listas_operacional": 4,
    "total_listas_clientes": 7,
    "tarefas_social_media": 71,
    "tarefas_assessoria": 37,
    "tarefas_trafego": 10,
    "total_tarefas_ativas": 118
  }
}
```

## 🤖 Integração com Claude

O Claude acessa este arquivo automaticamente quando solicitado, proporcionando:

- ✅ Dados sempre atualizados
- ✅ Acesso instantâneo  
- ✅ Análises em tempo real
- ✅ Zero configuração manual

---

**Criado para Rafael Rosa Marketing Online** 🎯