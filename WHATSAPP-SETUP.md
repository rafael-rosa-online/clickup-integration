# 📱 AUTOMAÇÕES CLICKUP + WHATSAPP - GUIA COMPLETO

## 🎯 **NOVA FUNCIONALIDADE IMPLEMENTADA:**

### ✅ **AUTOMAÇÃO ATUALIZADA:**
**Ao invés de email, agora envia para WhatsApp!**

```
QUANDO: Status muda para "aprovação cliente" + arquivo final válido
EXECUTA:
  📎 Coleta arquivos do campo "arquivo final"
  📝 Coleta conteúdo do campo "legenda"
  📱 Envia para grupo WhatsApp do cliente
  💬 Registra envio no ClickUp
```

---

## 🚀 **IMPLEMENTAÇÃO PASSO A PASSO**

### 1️⃣ **Instalação:**

```bash
git clone https://github.com/rafael-rosa-online/clickup-integration.git
cd clickup-integration
npm install
```

### 2️⃣ **Primeira Execução:**

```bash
npm start
```

**Vai aparecer um QR Code no terminal:**
```
📱 QR Code para WhatsApp Web:
███████████████████████████████
█ ▄▄▄▄▄ █▀█ █▄█▀▀▀▄▄██ ▄▄▄▄▄ █
█ █   █ █▀▀▀█ ▀ ▀▀▀  ▀█ █   █ █
█ █▄▄▄█ █▀ █▀▀▄ ▄▄▄▄ ▀█ █▄▄▄█ █
███████████████████████████████
👆 Escaneie o QR code acima com seu WhatsApp
```

### 3️⃣ **Conectar WhatsApp:**

1. **Abra o WhatsApp no celular**
2. **Vá em "Dispositivos vinculados"**  
3. **Escaneie o QR Code** que apareceu no terminal
4. **Aguarde a confirmação:**
   ```
   ✅ WhatsApp conectado com sucesso!
   📋 Carregando grupos do WhatsApp...
   ✅ Encontrados X grupos
   ```

### 4️⃣ **Verificar Grupos Mapeados:**

**Acesse:** `http://localhost:3000/whatsapp/groups`

**Resultado:**
```json
{
  "grupos_mapeados": {
    "futurize": {
      "id": "120363043965484519@g.us",
      "name": "Cliente - Futurize",
      "participants": 5
    },
    "2tok": {
      "id": "120363043965484520@g.us", 
      "name": "Projeto 2TOK",
      "participants": 3
    }
  },
  "total_grupos": 2
}
```

### 5️⃣ **Configurar Webhook:**

```bash
node setup-webhook.js https://seu-servidor.com/webhook/clickup
```

---

## 📱 **CONFIGURAÇÃO DOS GRUPOS WHATSAPP**

### 🎯 **Padrões de Nomes Reconhecidos:**

O sistema identifica grupos automaticamente pelos nomes:

| Padrão do Nome do Grupo | Cliente Detectado |
|------------------------|-------------------|
| `Cliente - Futurize` | Futurize |
| `Projeto 2TOK` | 2TOK |
| `ABS Baterias - Social Media` | ABS Baterias |
| `Celmáquinas Marketing` | Celmáquinas |
| `Estação Zero` | Estação Zero |

### 📋 **Como Organizar os Grupos:**

1. **Certifique-se que os grupos WhatsApp incluem:**
   - Você (Rafael Rosa)
   - Membros da equipe
   - Cliente(s)

2. **Nomes recomendados:**
   - `Cliente - [Nome do Cliente]`
   - `Projeto [Nome do Cliente]`
   - `[Nome do Cliente] - Social Media`

3. **O sistema mapeia automaticamente** baseado na lista do ClickUp

---

## 🧪 **TESTES**

### **Teste 1: Verificar Conexão**
```bash
curl http://localhost:3000/status
```

**Resposta esperada:**
```json
{
  "status": "running",
  "whatsapp_connected": true,
  "grupos_disponiveis": 5
}
```

### **Teste 2: Envio Manual**
```bash
curl -X POST http://localhost:3000/test/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"taskId": "ID_DA_TAREFA", "groupName": "Cliente - Futurize"}'
```

### **Teste 3: Fluxo Completo**
1. Criar tarefa no ClickUp na lista "Futurize"
2. Anexar arquivos com "final" no nome
3. Preencher campo "legenda"
4. Mudar status para "aprovação cliente"
5. **Resultado:** Mensagem automática no grupo WhatsApp!

---

## 📱 **FORMATO DA MENSAGEM WHATSAPP**

### **Mensagem Enviada:**
```
📋 *MATERIAL PARA APROVAÇÃO*

🎯 *Projeto:* Post Instagram - Black Friday

📝 *Legenda/Copy:*
🔥 BLACK FRIDAY IMPERDÍVEL! 
Descontos de até 50% em todos os produtos!
#BlackFriday #Promoção

📎 *Arquivos:* 2 arquivo(s)
• post_instagram_final.jpg
• stories_final.mp4

✅ _Por favor, analisem o material e retornem com aprovação ou ajustes._

💼 *Equipe Rafael Rosa Marketing*
```

### **Arquivos Enviados:**
- Cada arquivo é enviado separadamente
- Imagens aparecem como preview
- Vídeos são reproduzíveis
- PDFs ficam disponíveis para download

---

## ⚙️ **CONFIGURAÇÕES AVANÇADAS**

### 🎯 **Personalizar Mapeamento de Clientes:**

Edite o método `extractClientFromGroupName()` em `clickup-whatsapp-automations.js`:

```javascript
extractClientFromGroupName(groupName) {
    const patterns = [
        /cliente\s*-\s*(.+)/i,           // "Cliente - Nome"
        /projeto\s+(.+)/i,              // "Projeto Nome"
        /^(.+?)\s*-\s*social/i,         // "Nome - Social Media"
        // Adicione seus próprios padrões aqui
        /meu_cliente_(.+)/i,            // "meu_cliente_Nome"
    ];
    
    // resto do código...
}
```

### 📱 **Personalizar Mensagem:**

Edite o método `sendMainMessage()`:

```javascript
const message = `📋 *MATERIAL PARA APROVAÇÃO*\n\n` +
               `🎯 *Projeto:* ${taskDetails.name}\n\n` +
               // Personalize aqui a sua mensagem
               `📝 *Observações:* Favor analisar com atenção\n\n` +
               `✅ _Aguardamos retorno em até 24h._`;
```

---

## 🔧 **TROUBLESHOOTING**

### ❌ **"QR Code não aparece"**
```bash
# Limpar cache e tentar novamente
rm -rf .wwebjs_auth
npm start
```

### ❌ **"WhatsApp desconectou"**
```bash
# Verificar se WhatsApp Web está aberto em outro lugar
# Fechar outras sessões e reconectar
```

### ❌ **"Grupo não encontrado"**
1. Verificar se você está no grupo
2. Acessar `/whatsapp/groups` para ver grupos mapeados
3. Ajustar nome do grupo conforme padrões

### ❌ **"Arquivo não envia"**
1. Verificar se arquivo é acessível (URL válida)
2. Verificar tamanho do arquivo (WhatsApp tem limite)
3. Verificar formato suportado

---

## 🚀 **DEPLOY PARA PRODUÇÃO**

### **Heroku:**
```bash
# Importante: Heroku precisa de buildpack para Puppeteer
heroku buildpacks:add jontewks/puppeteer
heroku buildpacks:add heroku/nodejs
git push heroku main
```

### **VPS/Servidor:**
```bash
# Instalar dependências do Chrome
sudo apt-get update
sudo apt-get install -y chromium-browser

# PM2 para manter rodando
npm install -g pm2
pm2 start clickup-whatsapp-automations.js --name "clickup-whatsapp"
pm2 save
pm2 startup
```

---

## 📊 **MONITORAMENTO**

### **Logs em Tempo Real:**
```bash
npm start
# ou
pm2 logs clickup-whatsapp
```

### **Status da Conexão:**
```bash
curl http://localhost:3000/status
```

### **Grupos Disponíveis:**
```bash
curl http://localhost:3000/whatsapp/groups
```

---

## 🎯 **PRÓXIMAS MELHORIAS POSSÍVEIS**

- ✅ **Aprovação com botões** no WhatsApp
- ✅ **Múltiplos grupos** por cliente
- ✅ **Agendamento** de envios
- ✅ **Templates** personalizados por cliente
- ✅ **Histórico** de mensagens enviadas
- ✅ **Integração** com outros status
- ✅ **Notificações** de leitura

---

## 📞 **SUPORTE**

### 🆘 **Problemas Comuns:**
1. **QR Code:** Sempre escaneie com o celular principal
2. **Grupos:** Certifique-se de estar no grupo
3. **Arquivos:** Verifique URLs e formatos
4. **Deploy:** Use buildpack correto no Heroku

### 🔄 **Atualizações:**
```bash
git pull origin main
npm install
pm2 restart clickup-whatsapp
```

---

**🎉 AUTOMAÇÃO WHATSAPP IMPLEMENTADA COM SUCESSO!**

**✅ Validação automática de arquivos**  
**✅ Envio automático para grupos WhatsApp**  
**✅ Sistema inteligente de mapeamento de clientes**

**📱 Próximo passo:** Conectar WhatsApp e testar!