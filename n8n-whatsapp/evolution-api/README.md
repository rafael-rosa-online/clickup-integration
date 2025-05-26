# Evolution API - Railway Deployment

## 🚀 DEPLOY EM 3 CLIQUES

### 1️⃣ **Deploy no Railway**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/evolution-api)

**OU**

1. Acesse: https://railway.app/new
2. Conecte com GitHub 
3. Escolha este repositório: `rafael-rosa-online/clickup-integration`
4. Pasta: `/n8n-whatsapp/evolution-api`

### 2️⃣ **Configurar Variáveis**

No Railway Dashboard, adicione:

```bash
PORT=8080
EVOLUTION_API_URL=https://seuapp.railway.app
API_KEY=sua_chave_secreta_aqui
WEBHOOK_URL=https://rafaelrosaonline.app.n8n.cloud/webhook/whatsapp
```

### 3️⃣ **Pronto!**

URL da sua API: `https://seuapp.railway.app`

## 🔗 **Endpoints Principais**

- **Criar Instância:** `POST /instance/create`
- **Conectar WhatsApp:** `GET /instance/connect/INSTANCE_NAME`
- **Enviar Mensagem:** `POST /message/sendText/INSTANCE_NAME`
- **Status:** `GET /instance/fetchInstances`

## 📱 **Próximo Passo**

Após deploy, vamos configurar:
1. Criar instância WhatsApp
2. Conectar via QR Code
3. Configurar webhook para N8N
