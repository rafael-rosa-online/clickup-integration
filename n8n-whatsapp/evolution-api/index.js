const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use(limiter);

// Armazenar instâncias WhatsApp (em produção usar Redis/DB)
const instances = new Map();

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API key inválida' });
  }
  
  next();
};

// Routes públicas
app.get('/', (req, res) => {
  res.json({
    message: 'Evolution API - Rafael Rosa Marketing',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes protegidas
app.use('/instance', authenticate);
app.use('/message', authenticate);

// **1. CRIAR INSTÂNCIA**
app.post('/instance/create', async (req, res) => {
  try {
    const { instanceName = 'rafael-rosa-main' } = req.body;
    
    if (instances.has(instanceName)) {
      return res.json({
        error: false,
        message: 'Instância já existe',
        data: { instanceName, status: 'exists' }
      });
    }

    // Criar instância (simulada por enquanto)
    const instance = {
      instanceName,
      status: 'created',
      createdAt: new Date().toISOString(),
      qrCode: null,
      connected: false
    };
    
    instances.set(instanceName, instance);
    
    res.json({
      error: false,
      message: 'Instância criada com sucesso',
      data: instance
    });
    
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// **2. CONECTAR WHATSAPP (QR CODE)**
app.get('/instance/connect/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const instance = instances.get(instanceName);
    
    if (!instance) {
      return res.status(404).json({
        error: true,
        message: 'Instância não encontrada'
      });
    }

    // Simular QR Code (em produção seria o real)
    const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    
    instance.qrCode = qrCode;
    instance.status = 'qr_ready';
    
    res.json({
      error: false,
      message: 'QR Code gerado',
      data: {
        qrCode,
        instanceName,
        status: 'qr_ready'
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// **3. STATUS DA INSTÂNCIA**
app.get('/instance/fetchInstances', async (req, res) => {
  try {
    const allInstances = Array.from(instances.values());
    
    res.json({
      error: false,
      message: 'Instâncias recuperadas',
      data: allInstances
    });
    
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// **4. ENVIAR MENSAGEM TEXTO**
app.post('/message/sendText/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const { number, text } = req.body;
    
    const instance = instances.get(instanceName);
    
    if (!instance) {
      return res.status(404).json({
        error: true,
        message: 'Instância não encontrada'
      });
    }

    if (!instance.connected) {
      return res.status(400).json({
        error: true,
        message: 'WhatsApp não conectado'
      });
    }

    // Simular envio de mensagem
    const messageId = uuidv4();
    
    res.json({
      error: false,
      message: 'Mensagem enviada com sucesso',
      data: {
        messageId,
        to: number,
        text,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// **5. ENVIAR ARQUIVO**
app.post('/message/sendMedia/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const { number, media, caption = '' } = req.body;
    
    const instance = instances.get(instanceName);
    
    if (!instance) {
      return res.status(404).json({
        error: true,
        message: 'Instância não encontrada'
      });
    }

    if (!instance.connected) {
      return res.status(400).json({
        error: true,
        message: 'WhatsApp não conectado'
      });
    }

    const messageId = uuidv4();
    
    res.json({
      error: false,
      message: 'Arquivo enviado com sucesso',
      data: {
        messageId,
        to: number,
        media,
        caption,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// **6. SIMULAR CONEXÃO (para teste)**
app.post('/instance/simulate-connect/:instanceName', authenticate, async (req, res) => {
  try {
    const { instanceName } = req.params;
    const instance = instances.get(instanceName);
    
    if (!instance) {
      return res.status(404).json({
        error: true,
        message: 'Instância não encontrada'
      });
    }

    instance.connected = true;
    instance.status = 'connected';
    
    res.json({
      error: false,
      message: 'WhatsApp conectado (simulação)',
      data: instance
    });
    
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: true,
    message: 'Erro interno do servidor'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint não encontrado'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Evolution API rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${process.env.API_KEY || 'não configurada'}`);
});

module.exports = app;