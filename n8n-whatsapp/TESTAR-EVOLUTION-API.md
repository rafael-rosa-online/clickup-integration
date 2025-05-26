# 📱 TESTADOR EVOLUTION API - RAFAEL ROSA

## 🧪 TESTE 1: CRIAR INSTÂNCIA WHATSAPP

### Copie e cole no navegador:

```
https://evolution-api-rafael-rosa.onrender.com/instance/create
```

**Método:** POST  
**Headers:** `X-API-Key: RafaelRosa2025_API_WhatsApp_Secure_Key`  
**Body:** `{"instanceName": "rafael-rosa-main"}`

---

## 📋 USANDO POSTMAN/INSOMNIA:

### **1. Criar Instância:**
- **URL:** `https://evolution-api-rafael-rosa.onrender.com/instance/create`
- **Método:** POST
- **Headers:** `X-API-Key: RafaelRosa2025_API_WhatsApp_Secure_Key`
- **Body (JSON):**
```json
{
  "instanceName": "rafael-rosa-main"
}
```

### **2. Gerar QR Code:**
- **URL:** `https://evolution-api-rafael-rosa.onrender.com/instance/connect/rafael-rosa-main`
- **Método:** GET
- **Headers:** `X-API-Key: RafaelRosa2025_API_WhatsApp_Secure_Key`

### **3. Verificar Status:**
- **URL:** `https://evolution-api-rafael-rosa.onrender.com/instance/fetchInstances`
- **Método:** GET
- **Headers:** `X-API-Key: RafaelRosa2025_API_WhatsApp_Secure_Key`

### **4. Simular Conexão (para teste):**
- **URL:** `https://evolution-api-rafael-rosa.onrender.com/instance/simulate-connect/rafael-rosa-main`
- **Método:** POST
- **Headers:** `X-API-Key: RafaelRosa2025_API_WhatsApp_Secure_Key`

---

## 🚀 TESTANDO VIA BROWSER (MÉTODO SIMPLES)

Como nossa Evolution API é simplificada, você pode:

### **1. Simular conexão diretamente:**
```
https://evolution-api-rafael-rosa.onrender.com/instance/simulate-connect/rafael-rosa-main
```

### **2. Verificar se funcionou:**
```
https://evolution-api-rafael-rosa.onrender.com/instance/fetchInstances
```

---

## 📱 PRÓXIMO PASSO

Depois de conectar o WhatsApp:
1. ✅ Criar/simular instância
2. ✅ Testar envio de mensagem
3. ✅ Testar automação completa ClickUp → WhatsApp
