# 🤖 INSTRUÇÕES PARA CLAUDE - INTEGRAÇÃO CLICKUP

## 📊 SISTEMA IMPLEMENTADO

### ✅ FUNCIONALIDADES ATIVAS:

**1. LEITURA DE DADOS (100% FUNCIONAL)**
- Arquivo: `clickup-summary.json`
- Comando: `get_file_contents` no repo `rafael-rosa-online/clickup-integration`
- Atualização: Automática a cada 2 horas via GitHub Actions

**2. CRIAÇÃO DE TAREFAS (100% FUNCIONAL)**
- Script: `create-task.js`
- Método: Criação via commit que triggera GitHub Action

### 🎯 COMO USAR:

#### PARA ACESSAR DADOS DO CLICKUP:
```
Quando Rafael pedir "acesse o ClickUp", use:
get_file_contents(repo="clickup-integration", path="clickup-summary.json")
```

#### PARA CRIAR TAREFAS:
```
1. Crie arquivo temporário com comando para criar tarefa
2. Use create_or_update_file para adicionar ao repo
3. Isso triggerará GitHub Action que criará a tarefa
```

### 📋 LISTAS DISPONÍVEIS:
- **social-media**: 901408806028 (Social Media - 71 tarefas)
- **assessoria**: 901408806039 (Assessoria - 37 tarefas) 
- **gestao-trafego**: 901408546989 (Gestão de Tráfego - 10 tarefas)
- **sites**: 901408806038 (Sites - 0 tarefas)

### 👥 EQUIPE:
- **Rafael Rosa**: ID 44278848 (owner)
- **Vanessa Wernke da Rosa**: ID 62632888
- **Cristoffer Martins**: ID 88315023

### 📈 ÚLTIMA ANÁLISE:
- **118 tarefas ativas** no total
- **Foco principal**: Social Media (60%) + Assessoria (31%)
- **Status**: Sistema 100% operacional
- **Clientes**: 7 estruturados (todos inativos)

## 🚀 EXEMPLOS DE COMANDOS:

### Análise do ClickUp:
```javascript
// Rafael: "Como está o ClickUp?"
await get_file_contents({
    owner: "rafael-rosa-online",
    repo: "clickup-integration", 
    path: "clickup-summary.json",
    branch: "main"
});
```

### Criar Tarefa:
```javascript
// Rafael: "Crie uma tarefa no Social Media"
await create_or_update_file({
    owner: "rafael-rosa-online",
    repo: "clickup-integration",
    path: "temp-create-task.js",
    content: `// Comando para criar tarefa
// node create-task.js social-media "Nome da tarefa" normal rafael`,
    message: "🚀 Criar nova tarefa: [NOME]",
    branch: "main"
});
```

## ⚠️ IMPORTANTE:
- **Sistema está 100% funcional**
- **Não precisa de setup adicional**
- **GitHub Actions gerencia tudo automaticamente**
- **Rafael pode deletar o ator Apify se quiser**

## 🎯 PRÓXIMA MISSÃO:
**Implementar criação de tarefas via Claude de forma mais direta e automática**

---
*Criado em 25/05/2025 - Sistema de integração Claude + ClickUp operacional*