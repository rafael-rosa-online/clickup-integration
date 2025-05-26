# 🚀 IMPORTAR WORKFLOW N8N - PASSO A PASSO

## 📋 **VISÃO GERAL DO WORKFLOW**

O workflow criado faz **EXATAMENTE** o que sua automação Node.js fazia:

✅ **Trigger:** ClickUp webhook (status → "aprovação cliente")  
✅ **Validações:** Arquivos, cliente, legenda obrigatórios  
✅ **Mapeamento:** Cliente → grupo WhatsApp  
✅ **Envio:** Mensagem + arquivos via Evolution API  
✅ **Feedback:** Comentários no ClickUp (sucesso/erro)  
✅ **Rollback:** Reverte status se erro  

## 🎯 **PASSO 1: ACESSAR SEU N8N**

👉 **https://rafaelrosaonline.app.n8n.cloud**

## 🎯 **PASSO 2: IMPORTAR WORKFLOW**

### **2.1 Novo Workflow**
- Clique **"+"** (New Workflow)
- Clique **"..."** (3 pontos) → **"Import from JSON"**

### **2.2 Copiar JSON**
- Abra: https://github.com/rafael-rosa-online/clickup-integration/blob/main/n8n-whatsapp/workflows/clickup-whatsapp-automation.json
- Clique **"Raw"**
- Copie **TODO** o conteúdo
- Cole no N8N

### **2.3 Importar**
- Clique **"Import"**
- O workflow aparecerá com vários nodes conectados

## 🎯 **PASSO 3: CONFIGURAR CREDENCIAIS**

### **3.1 Credencial ClickUp API**
- Clique no node **"Get Task Details"**
- Configure **Authentication:**
  - Type: **Generic Credential Type**
  - Generic Auth Type: **HTTP Header Auth**
  - Name: `clickup-api`
  - Header Name: `Authorization`
  - Value: `pk_44278848_FK81OR2OL487GOJYCHJPJ345Z55G6RZ7`

### **3.2 Aplicar em Todos os Nodes ClickUp**
- **"Add Error Comment"** → usar mesma credencial
- **"Revert Status"** → usar mesma credencial  
- **"Add Success Comment"** → usar mesma credencial

## 🎯 **PASSO 4: ATIVAR WORKFLOW**

- Clique no **toggle** (switch) no canto superior direito
- Status deve ficar **"Active"**

## 🎯 **PASSO 5: CONFIGURAR WEBHOOK NO CLICKUP**

### **5.1 Copiar URL do Webhook**
- Clique no node **"ClickUp Webhook"**
- Copie a **"Webhook URL"** (algo como: `https://rafaelrosaonline.app.n8n.cloud/webhook/clickup-whatsapp`)

### **5.2 Configurar no ClickUp**
- Vá no ClickUp → **Settings** → **Webhooks**
- **Add Webhook:**
  - **Endpoint:** Cole a URL do N8N
  - **Events:** ✅ Task Status Updated
  - **Space:** OPERACIONAL (90142603854)

## 🧪 **PASSO 6: TESTAR**

### **6.1 Teste Básico**
1. Crie tarefa na lista **"Social Media"**
2. Preencha:
   - **Cliente:** "Rafael Rosa Marketing Online"
   - **Legenda:** "Teste automação N8N"
   - **Anexe** um arquivo
3. **Mude status** para **"APROVAÇÃO CLIENTE"**

### **6.2 Verificar Resultado**
- ✅ N8N deve executar o workflow
- ✅ Mensagem deve aparecer no grupo WhatsApp "automacao clickup"
- ✅ Comentário automático deve aparecer no ClickUp

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **Mapeamento Clientes → Grupos**
O workflow já inclui:
```javascript
const gruposWhatsApp = {
  'Rafael Rosa Marketing Online': 'automacao clickup',
  'Futurize': 'CLIENTE - Futurize',
  '2TOK': 'PROJETO - 2TOK',
  'ABS Baterias': 'ABS BATERIAS - Social',
  'ZOQE': 'ZOQE - Marketing'
};
```

### **Evolution API URL**
- Já configurada: `https://evolution-api-rafael-rosa.onrender.com`
- API Key: `RafaelRosa2025_API_WhatsApp_Secure_Key`

## 🆘 **TROUBLESHOOTING**

### ❌ **"Credential not found"**
- Recrie a credencial ClickUp conforme Passo 3.1

### ❌ **"Webhook not triggered"**
- Verifique se webhook está ativo no ClickUp
- Teste a URL do webhook diretamente

### ❌ **"Evolution API error"**
- Verifique se sua Evolution API está rodando
- Teste: https://evolution-api-rafael-rosa.onrender.com/health

---

**🎯 PRÓXIMO PASSO:** Importe o workflow no N8N e me diga se conseguiu!