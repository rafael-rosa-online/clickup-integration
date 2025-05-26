# 🚀 DEPLOY RAILWAY - PASSO A PASSO

## ✅ **AGORA VOCÊ VAI FAZER O DEPLOY:**

### **1️⃣ Acesse o Railway**
👉 https://railway.app/login

- Clique em **"Login with GitHub"**
- Autorize o Railway

### **2️⃣ Criar Novo Projeto**
- Clique **"New Project"**
- Escolha **"Deploy from GitHub repo"**
- Selecione: `rafael-rosa-online/clickup-integration`

### **3️⃣ Configurar Deploy**
- **Root Directory:** `/n8n-whatsapp/evolution-api`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### **4️⃣ Adicionar Variáveis de Ambiente**
No painel Railway, vá em **"Variables"** e adicione:

```bash
API_KEY=RafaelRosa2025_API_WhatsApp_Secure_Key
NODE_ENV=production
```

### **5️⃣ Deploy Automático**
- Railway vai fazer o build automaticamente
- Aguarde 2-3 minutos
- Sua URL será algo como: `https://n8n-whatsapp-production-XXXX.up.railway.app`

## 🧪 **TESTAR SE FUNCIONOU**

### **Teste 1: Health Check**
```bash
curl https://sua-url.railway.app/health
```

**Resposta esperada:**
```json
{"status":"ok","timestamp":"2025-05-26T01:00:00.000Z"}
```

### **Teste 2: Criar Instância WhatsApp**
```bash
curl -X POST https://sua-url.railway.app/instance/create \
  -H "X-API-Key: RafaelRosa2025_API_WhatsApp_Secure_Key" \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "rafael-rosa-main"}'
```

**Resposta esperada:**
```json
{
  "error": false,
  "message": "Instância criada com sucesso",
  "data": {...}
}
```

## ✅ **PRONTO!**

Quando conseguir as respostas acima, sua **Evolution API está funcionando!**

**Próximos passos:**
- Configurar N8N para usar esta API
- Migrar lógica do WhatsApp
- Testar envio de mensagens

## 🆘 **PROBLEMAS?**

### ❌ **Deploy Failed**
- Verifique se selecionou a pasta correta: `/n8n-whatsapp/evolution-api`
- Verifique se as variáveis estão corretas

### ❌ **401 Unauthorized**
- Verifique se o `API_KEY` está correto
- Verifique se está usando o header `X-API-Key`

### ❌ **500 Internal Error**
- Verifique os logs no Railway Dashboard
- Verifique se todas as dependências instalaram

---

**📱 Me diga quando conseguir fazer o deploy!**