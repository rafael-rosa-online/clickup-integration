# 🤖 AUTOMAÇÕES CLICKUP - IMPLEMENTAÇÃO COMPLETA

## 🎯 **AUTOMAÇÕES CRIADAS:**

### ✅ **AUTOMAÇÃO 1: Validação de "Arquivo Final"**
- **Quando:** Status muda para "aprovação cliente"
- **Validação:** Verifica se campo "arquivo final" tem anexos
- **Ação:** Se não tiver arquivos, reverte status e notifica

### ✅ **AUTOMAÇÃO 2: Envio Automático para Cliente**
- **Quando:** Status "aprovação cliente" E arquivo final válido
- **Ação:** Envia email com arquivos + legenda automaticamente

---

## 🚀 **IMPLEMENTAÇÃO - PASSO A PASSO**

### 📋 **OPÇÃO 1: Deploy Rápido (Heroku/Railway/Vercel)**

#### **1. Clonar repositório:**
```bash
git clone https://github.com/rafael-rosa-online/clickup-integration.git
cd clickup-integration
```

#### **2. Instalar dependências:**
```bash
npm install
```

#### **3. Configurar email (Gmail):**
No arquivo `clickup-automations.js`, ajustar:
```javascript
this.emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'rafaelrosaonline@gmail.com',
        pass: 'SUA_SENHA_DE_APP_GMAIL' // ← Gerar no Google
    }
});
```

#### **4. Fazer deploy:**

**Heroku:**
```bash
heroku create rafael-clickup-automations
git push heroku main
```

**Railway:**
```bash
railway login
railway link
railway up
```

#### **5. Configurar webhook:**
```bash
node setup-webhook.js https://seu-app.herokuapp.com/webhook/clickup
```

---

### 📋 **OPÇÃO 2: Servidor Local (Desenvolvimento)**

#### **1. Executar localmente:**
```bash
npm start
# Servidor roda na porta 3000
```

#### **2. Expor com ngrok:**
```bash
# Instalar ngrok: https://ngrok.com/
ngrok http 3000
# Copiar URL pública (ex: https://abc123.ngrok.io)
```

#### **3. Configurar webhook:**
```bash
node setup-webhook.js https://abc123.ngrok.io/webhook/clickup
```

---

## 🧪 **TESTE DAS AUTOMAÇÕES**

### **Teste 1: Validação de Arquivo Final**
1. Criar uma tarefa no ClickUp
2. **NÃO** anexar arquivos no campo "arquivo final"
3. Mudar status para "aprovação cliente"
4. **Resultado esperado:**
   - Status reverte automaticamente
   - Comentário aparece explicando o erro

### **Teste 2: Envio Automático**
1. Criar uma tarefa no ClickUp
2. **Anexar arquivos** com nome contendo "final"
3. **Preencher campo "legenda"** (se existir)
4. Mudar status para "aprovação cliente"
5. **Resultado esperado:**
   - Email enviado automaticamente
   - Comentário confirmando envio

### **Teste via API (desenvolvimento):**
```bash
curl -X POST http://localhost:3000/test/automation \
  -H "Content-Type: application/json" \
  -d '{"taskId": "ID_DA_TAREFA", "newStatus": "aprovação cliente"}'
```

---

## ⚙️ **CONFIGURAÇÕES AVANÇADAS**

### 📧 **Configurar Email (Outros Provedores):**

**Outlook/Hotmail:**
```javascript
service: 'hotmail',
auth: {
    user: 'seu-email@outlook.com',
    pass: 'sua-senha'
}
```

**SMTP Customizado:**
```javascript
host: 'smtp.seudominio.com',
port: 587,
secure: false,
auth: {
    user: 'noreply@seudominio.com',
    pass: 'sua-senha'
}
```

### 🎯 **Personalizar Status:**
No arquivo `clickup-automations.js`, linha 95:
```javascript
// Adicionar outros status que ativam a automação
if (newStatus === 'aprovação cliente' || 
    newStatus === 'aprovacao cliente' ||
    newStatus === 'pending approval' ||
    newStatus === 'cliente aprovar') {
    await this.validateClientApproval(taskId);
}
```

### 📋 **Personalizar Campos:**
Ajustar detecção de campos personalizados:
```javascript
// Para campo "arquivo final"
field.name?.toLowerCase().includes('arquivo final') ||
field.name?.toLowerCase().includes('arquivos finais') ||
field.name?.toLowerCase().includes('material final')

// Para campo "legenda" 
field.name?.toLowerCase().includes('legenda') ||
field.name?.toLowerCase().includes('copy') ||
field.name?.toLowerCase().includes('texto do post')
```

---

## 📊 **MONITORAMENTO**

### **Logs do Sistema:**
```bash
# Ver logs em tempo real
npm start

# Ou se usando PM2
pm2 logs clickup-automations
```

### **Endpoint de Status:**
```
GET https://seu-app.herokuapp.com/status
```

### **Webhooks Ativos:**
```bash
node setup-webhook.js test
```

---

## 🔧 **TROUBLESHOOTING**

### ❌ **"Webhook não está funcionando"**
1. Verificar se URL está acessível
2. Verificar logs do servidor
3. Recriar webhook: `node setup-webhook.js URL`

### ❌ **"Email não está sendo enviado"**
1. Verificar credenciais de email
2. Para Gmail: usar senha de aplicativo
3. Verificar logs de erro

### ❌ **"Automação não ativa"**
1. Verificar se status está exatamente correto
2. Verificar se webhook recebe eventos
3. Testar com endpoint `/test/automation`

---

## 🚀 **PRÓXIMAS MELHORIAS**

### 🎯 **Possíveis Expansões:**
- ✅ Integração com WhatsApp Business
- ✅ Notificações no Slack
- ✅ Dashboard web para monitoramento
- ✅ Múltiplos clientes por tarefa
- ✅ Templates de email personalizados
- ✅ Aprovação com botões no email
- ✅ Histórico de envios

### 📱 **Integrações Adicionais:**
- **Zapier:** Para conectar com outras ferramentas
- **Make.com:** Automações visuais
- **n8n:** Workflow open source

---

## 📞 **SUPORTE**

### 🆘 **Ajuda:**
- **Email:** rafaelrosaonline@gmail.com
- **Repositório:** rafael-rosa-online/clickup-integration
- **Logs:** Verificar sempre os logs do servidor

### 🔄 **Atualizações:**
```bash
git pull origin main
npm install
# Reiniciar servidor
```

---

**🎉 AUTOMAÇÕES IMPLEMENTADAS COM SUCESSO!**

**✅ Validação automática de arquivos**  
**✅ Envio automático para clientes**  
**✅ Sistema completo e escalável**

**🚀 Próximo passo:** Fazer deploy e configurar webhook!