const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configurações
const API_TOKEN = 'pk_44278848_FK81OR2OL487GOJYCHJPJ345Z55G6RZ7';
const WEBHOOK_SECRET = 'clickup_webhook_secret_2025';

// Headers para ClickUp API
const headers = {
    'Authorization': API_TOKEN,
    'Content-Type': 'application/json'
};

class ClickUpWhatsAppAutomations {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.setupWhatsApp();
        this.setupRoutes();
        this.gruposWhatsApp = {}; // Cache dos grupos por cliente
    }

    setupWhatsApp() {
        // Configurar cliente WhatsApp com sessão persistente
        this.whatsapp = new Client({
            authStrategy: new LocalAuth({
                clientId: 'rafael-rosa-clickup-bot'
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            }
        });

        // Eventos do WhatsApp
        this.whatsapp.on('qr', (qr) => {
            console.log('📱 QR Code para WhatsApp Web:');
            qrcode.generate(qr, { small: true });
            console.log('👆 Escaneie o QR code acima com seu WhatsApp');
        });

        this.whatsapp.on('ready', () => {
            console.log('✅ WhatsApp conectado com sucesso!');
            this.loadWhatsAppGroups();
        });

        this.whatsapp.on('authenticated', () => {
            console.log('🔐 WhatsApp autenticado!');
        });

        this.whatsapp.on('auth_failure', (msg) => {
            console.error('❌ Falha na autenticação WhatsApp:', msg);
        });

        this.whatsapp.on('disconnected', (reason) => {
            console.log('🔌 WhatsApp desconectado:', reason);
        });

        // Inicializar WhatsApp
        this.whatsapp.initialize();
    }

    async loadWhatsAppGroups() {
        try {
            console.log('📋 Carregando grupos do WhatsApp...');
            const chats = await this.whatsapp.getChats();
            const groups = chats.filter(chat => chat.isGroup);
            
            console.log(`✅ Encontrados ${groups.length} grupos`);
            
            // Mapear grupos por nome (você pode ajustar a lógica de mapeamento)
            for (const group of groups) {
                console.log(`   📱 Grupo: ${group.name} (ID: ${group.id._serialized})`);
                
                // Mapear grupos baseado no nome
                // Exemplo: "Cliente - Futurize" -> cliente "Futurize"
                const clientName = this.extractClientFromGroupName(group.name);
                if (clientName) {
                    this.gruposWhatsApp[clientName.toLowerCase()] = {
                        id: group.id._serialized,
                        name: group.name,
                        participants: group.participants?.length || 0
                    };
                }
            }
            
            console.log('📊 Mapeamento de clientes:');
            Object.entries(this.gruposWhatsApp).forEach(([cliente, grupo]) => {
                console.log(`   👤 ${cliente} -> 📱 ${grupo.name} (${grupo.participants} participantes)`);
            });
            
        } catch (error) {
            console.error('❌ Erro ao carregar grupos WhatsApp:', error);
        }
    }

    extractClientFromGroupName(groupName) {
        // Lógica para extrair nome do cliente do nome do grupo
        // Exemplos de padrões:
        // "Cliente - Futurize" -> "Futurize"
        // "Projeto 2TOK" -> "2TOK"  
        // "ABS Baterias - Social Media" -> "ABS Baterias"
        
        const patterns = [
            /cliente\s*-\s*(.+)/i,           // "Cliente - Nome"
            /projeto\s+(.+)/i,              // "Projeto Nome"
            /^(.+?)\s*-\s*social/i,         // "Nome - Social Media"
            /^(.+?)\s*-\s*marketing/i,      // "Nome - Marketing"
            /^(futurize|2tok|celmáquinas|abs baterias|estação zero|zoqe|cromocil)/i // Nomes diretos
        ];
        
        for (const pattern of patterns) {
            const match = groupName.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        // Se não encontrou padrão, retorna o nome completo do grupo
        return groupName;
    }

    setupRoutes() {
        // Endpoint para receber webhooks do ClickUp
        this.app.post('/webhook/clickup', async (req, res) => {
            try {
                const event = req.body;
                
                console.log('🔔 Webhook recebido:', {
                    event: event.event,
                    task_id: event.task_id,
                    timestamp: new Date().toISOString()
                });

                // Processar eventos de mudança de status
                if (event.event === 'taskStatusUpdated') {
                    await this.handleStatusChange(event);
                }

                res.status(200).json({ status: 'processed' });
            } catch (error) {
                console.error('❌ Erro no webhook:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Endpoint para testar envio WhatsApp
        this.app.post('/test/whatsapp', async (req, res) => {
            try {
                const { taskId, groupName } = req.body;
                
                const taskDetails = await this.getTaskDetails(taskId);
                if (taskDetails) {
                    await this.sendToWhatsAppGroup(taskId, taskDetails, groupName);
                    res.json({ status: 'sent', message: 'Mensagem enviada para WhatsApp' });
                } else {
                    res.status(404).json({ error: 'Tarefa não encontrada' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Endpoint para listar grupos WhatsApp
        this.app.get('/whatsapp/groups', (req, res) => {
            res.json({
                grupos_mapeados: this.gruposWhatsApp,
                total_grupos: Object.keys(this.gruposWhatsApp).length
            });
        });

        // Endpoint de status
        this.app.get('/status', (req, res) => {
            res.json({
                status: 'running',
                whatsapp_connected: this.whatsapp?.info?.connected || false,
                timestamp: new Date().toISOString(),
                automations: [
                    'Validação arquivo final antes de aprovação cliente',
                    'Envio automático de arquivos e legenda via WhatsApp'
                ],
                grupos_disponiveis: Object.keys(this.gruposWhatsApp).length
            });
        });
    }

    async handleStatusChange(event) {
        const taskId = event.task_id;
        const statusChange = event.history_items?.find(item => item.field === 'status');
        
        if (!statusChange) return;

        const newStatus = statusChange.after?.status?.toLowerCase();
        
        console.log(`📊 Tarefa ${taskId} mudou para status: ${newStatus}`);

        // AUTOMAÇÃO 1: Validar "aprovação cliente"
        if (newStatus === 'aprovação cliente' || newStatus === 'aprovacao cliente') {
            await this.validateClientApproval(taskId);
        }
    }

    async validateClientApproval(taskId) {
        try {
            console.log(`🔍 Validando aprovação cliente para tarefa: ${taskId}`);

            // 1. Buscar detalhes completos da tarefa
            const taskDetails = await this.getTaskDetails(taskId);
            
            if (!taskDetails) {
                console.error(`❌ Não foi possível obter detalhes da tarefa ${taskId}`);
                return;
            }

            // 2. Verificar se campo "arquivo final" tem anexos
            const hasArquivoFinal = await this.checkArquivoFinalField(taskDetails);
            
            if (!hasArquivoFinal) {
                // REVERTER STATUS
                await this.revertTaskStatus(taskId, taskDetails);
                
                // NOTIFICAR USUÁRIO
                await this.notifyUser(taskDetails, 'ARQUIVO_FINAL_OBRIGATORIO');
                
                console.log(`⚠️ Tarefa ${taskId} revertida - campo "arquivo final" vazio`);
                return;
            }

            // 3. Se passou na validação, executar AUTOMAÇÃO 2 (envio WhatsApp)
            await this.sendToWhatsAppGroup(taskId, taskDetails);
            
        } catch (error) {
            console.error(`❌ Erro na validação de aprovação cliente:`, error);
        }
    }

    async getTaskDetails(taskId) {
        try {
            const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, { headers });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar detalhes da tarefa ${taskId}:`, error);
            return null;
        }
    }

    async checkArquivoFinalField(taskDetails) {
        // Método 1: Verificar campos customizados por "arquivo final"
        const arquivoFinalField = taskDetails.custom_fields?.find(field => 
            field.name?.toLowerCase().includes('arquivo final') ||
            field.name?.toLowerCase().includes('arquivo-final') ||
            field.name?.toLowerCase().includes('arquivofinal')
        );

        if (arquivoFinalField && arquivoFinalField.value) {
            console.log(`✅ Campo "arquivo final" encontrado com valor`);
            return true;
        }

        // Método 2: Verificar anexos gerais da tarefa
        try {
            const attachmentsResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskDetails.id}/attachment`, { headers });
            
            if (attachmentsResponse.ok) {
                const attachments = await attachmentsResponse.json();
                
                if (attachments.attachments && attachments.attachments.length > 0) {
                    // Verificar se há anexos com palavras-chave relacionadas a "arquivo final"
                    const finalFiles = attachments.attachments.filter(att => 
                        att.name?.toLowerCase().includes('final') ||
                        att.name?.toLowerCase().includes('aprovacao') ||
                        att.name?.toLowerCase().includes('cliente')
                    );
                    
                    if (finalFiles.length > 0) {
                        console.log(`✅ Anexos "arquivo final" encontrados: ${finalFiles.length}`);
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao verificar anexos:', error);
        }

        console.log(`❌ Campo "arquivo final" não encontrado ou vazio`);
        return false;
    }

    async revertTaskStatus(taskId, taskDetails) {
        try {
            const previousStatus = 'em andamento';
            
            const updateData = { status: previousStatus };

            const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                console.log(`🔄 Status da tarefa ${taskId} revertido para: ${previousStatus}`);
                
                await this.addComment(taskId, 
                    `⚠️ AUTOMAÇÃO: Status revertido automaticamente. ` +
                    `Para mover para "Aprovação Cliente", é necessário anexar arquivos no campo "Arquivo Final".`
                );
            }
        } catch (error) {
            console.error('Erro ao reverter status:', error);
        }
    }

    async sendToWhatsAppGroup(taskId, taskDetails, forceGroupName = null) {
        try {
            console.log(`📱 Enviando para WhatsApp - Tarefa: ${taskId}`);

            // 1. Identificar grupo do cliente
            const clienteInfo = this.extractClientInfo(taskDetails);
            const groupInfo = forceGroupName ? 
                this.findGroupByName(forceGroupName) : 
                this.findGroupForClient(clienteInfo.nome);
            
            if (!groupInfo) {
                await this.addComment(taskId, 
                    `❌ AUTOMAÇÃO: Grupo WhatsApp não encontrado para cliente "${clienteInfo.nome}". ` +
                    `Grupos disponíveis: ${Object.keys(this.gruposWhatsApp).join(', ')}`
                );
                return;
            }

            // 2. Coletar legenda
            const legenda = this.extractLegendaField(taskDetails);
            
            // 3. Coletar arquivos
            const arquivos = await this.extractArquivoFinalFiles(taskDetails);
            
            // 4. Enviar mensagem principal
            await this.sendMainMessage(groupInfo.id, taskDetails, legenda, arquivos);
            
            // 5. Enviar arquivos
            await this.sendFiles(groupInfo.id, arquivos);
            
            // 6. Registrar no ClickUp
            await this.addComment(taskId, 
                `✅ AUTOMAÇÃO: Material enviado para WhatsApp automaticamente!\n` +
                `📱 Grupo: ${groupInfo.name}\n` +
                `📎 Arquivos: ${arquivos.length}\n` +
                `📝 Legenda: ${legenda ? 'Incluída' : 'Não informada'}`
            );

            console.log(`✅ Envio WhatsApp concluído para tarefa ${taskId}`);
            
        } catch (error) {
            console.error('Erro no envio WhatsApp:', error);
            
            await this.addComment(taskId, 
                `❌ AUTOMAÇÃO: Erro no envio WhatsApp. Erro: ${error.message}\n` +
                `Favor enviar manualmente.`
            );
        }
    }

    findGroupForClient(clientName) {
        const normalizedClientName = clientName.toLowerCase();
        
        // Busca exata
        if (this.gruposWhatsApp[normalizedClientName]) {
            return this.gruposWhatsApp[normalizedClientName];
        }
        
        // Busca parcial
        for (const [cliente, grupo] of Object.entries(this.gruposWhatsApp)) {
            if (cliente.includes(normalizedClientName) || normalizedClientName.includes(cliente)) {
                return grupo;
            }
        }
        
        return null;
    }

    findGroupByName(groupName) {
        for (const grupo of Object.values(this.gruposWhatsApp)) {
            if (grupo.name.toLowerCase().includes(groupName.toLowerCase())) {
                return grupo;
            }
        }
        return null;
    }

    async sendMainMessage(groupId, taskDetails, legenda, arquivos) {
        const message = `📋 *MATERIAL PARA APROVAÇÃO*\n\n` +
                       `🎯 *Projeto:* ${taskDetails.name}\n\n` +
                       `${legenda ? `📝 *Legenda/Copy:*\n${legenda}\n\n` : ''}` +
                       `📎 *Arquivos:* ${arquivos.length} arquivo(s)\n` +
                       `${arquivos.map(arquivo => `• ${arquivo.name}`).join('\n')}\n\n` +
                       `✅ _Por favor, analisem o material e retornem com aprovação ou ajustes._\n\n` +
                       `💼 *Equipe Rafael Rosa Marketing*`;

        await this.whatsapp.sendMessage(groupId, message);
        console.log(`📱 Mensagem principal enviada para grupo ${groupId}`);
    }

    async sendFiles(groupId, arquivos) {
        for (const arquivo of arquivos) {
            try {
                console.log(`📎 Enviando arquivo: ${arquivo.name}`);
                
                // Baixar arquivo do ClickUp
                const response = await fetch(arquivo.url);
                if (!response.ok) {
                    console.error(`❌ Erro ao baixar ${arquivo.name}: ${response.statusText}`);
                    continue;
                }
                
                const buffer = await response.arrayBuffer();
                const media = new MessageMedia(
                    this.getMimeType(arquivo.extension),
                    Buffer.from(buffer).toString('base64'),
                    arquivo.name
                );
                
                await this.whatsapp.sendMessage(groupId, media);
                console.log(`✅ Arquivo enviado: ${arquivo.name}`);
                
                // Pausa entre envios para evitar spam
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Erro ao enviar arquivo ${arquivo.name}:`, error);
            }
        }
    }

    getMimeType(extension) {
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'pdf': 'application/pdf',
            'mp4': 'video/mp4',
            'mp3': 'audio/mpeg',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        return mimeTypes[extension?.toLowerCase()] || 'application/octet-stream';
    }

    extractLegendaField(taskDetails) {
        const legendaField = taskDetails.custom_fields?.find(field => 
            field.name?.toLowerCase().includes('legenda') ||
            field.name?.toLowerCase().includes('texto') ||
            field.name?.toLowerCase().includes('copy') ||
            field.name?.toLowerCase().includes('descrição')
        );

        if (legendaField && legendaField.value) {
            return legendaField.value;
        }

        return taskDetails.description || taskDetails.text_content || '';
    }

    async extractArquivoFinalFiles(taskDetails) {
        const arquivos = [];
        
        try {
            const response = await fetch(`https://api.clickup.com/api/v2/task/${taskDetails.id}/attachment`, { headers });
            
            if (response.ok) {
                const attachments = await response.json();
                
                const finalFiles = attachments.attachments?.filter(att => 
                    att.name?.toLowerCase().includes('final') ||
                    att.name?.toLowerCase().includes('aprovacao') ||
                    att.name?.toLowerCase().includes('cliente') ||
                    !att.name?.toLowerCase().includes('rascunho')
                ) || [];

                for (const file of finalFiles) {
                    arquivos.push({
                        name: file.name,
                        url: file.url,
                        size: file.size,
                        extension: file.extension
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao extrair arquivos:', error);
        }

        return arquivos;
    }

    extractClientInfo(taskDetails) {
        const clienteInfo = {
            nome: 'Cliente',
            grupo: null
        };

        if (taskDetails.list?.name) {
            clienteInfo.nome = taskDetails.list.name;
        }

        return clienteInfo;
    }

    async addComment(taskId, message) {
        try {
            const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/comment`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    comment_text: message
                })
            });

            if (response.ok) {
                console.log(`💬 Comentário adicionado à tarefa ${taskId}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
        }
    }

    async notifyUser(taskDetails, notificationType) {
        const messages = {
            'ARQUIVO_FINAL_OBRIGATORIO': 
                `🚨 ATENÇÃO: Para mover esta tarefa para "Aprovação Cliente", ` +
                `é obrigatório anexar arquivos no campo "Arquivo Final". ` +
                `Status revertido automaticamente.`
        };

        const message = messages[notificationType] || 'Notificação automática do sistema.';
        await this.addComment(taskDetails.id, message);
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`🚀 Servidor de automações ClickUp + WhatsApp rodando na porta ${port}`);
            console.log(`📡 Webhook endpoint: http://localhost:${port}/webhook/clickup`);
            console.log(`📱 Grupos WhatsApp: http://localhost:${port}/whatsapp/groups`);
            console.log(`🧪 Teste WhatsApp: http://localhost:${port}/test/whatsapp`);
            console.log(`📊 Status: http://localhost:${port}/status`);
        });
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    const automations = new ClickUpWhatsAppAutomations();
    automations.start();
}

module.exports = ClickUpWhatsAppAutomations;