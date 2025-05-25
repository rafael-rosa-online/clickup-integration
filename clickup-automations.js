const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Configurações
const API_TOKEN = 'pk_44278848_FK81OR2OL487GOJYCHJPJ345Z55G6RZ7';
const WEBHOOK_SECRET = 'clickup_webhook_secret_2025'; // Definir um secret para segurança

// Headers para ClickUp API
const headers = {
    'Authorization': API_TOKEN,
    'Content-Type': 'application/json'
};

class ClickUpAutomations {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.setupRoutes();
        this.setupEmailTransporter();
    }

    setupEmailTransporter() {
        // Configurar transportador de email (ajustar conforme seu provedor)
        this.emailTransporter = nodemailer.createTransporter({
            // Exemplo para Gmail (ajustar conforme necessário)
            service: 'gmail',
            auth: {
                user: 'rafaelrosaonline@gmail.com', // Ajustar
                pass: 'sua_senha_de_app' // Usar senha de app do Gmail
            }
        });
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

        // Endpoint para testar as automações
        this.app.post('/test/automation', async (req, res) => {
            try {
                const { taskId, newStatus } = req.body;
                
                // Simular evento de mudança de status
                const mockEvent = {
                    event: 'taskStatusUpdated',
                    task_id: taskId,
                    history_items: [{
                        field: 'status',
                        after: { status: newStatus }
                    }]
                };

                await this.handleStatusChange(mockEvent);
                res.json({ status: 'tested', message: 'Automação testada com sucesso' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Endpoint de status
        this.app.get('/status', (req, res) => {
            res.json({
                status: 'running',
                timestamp: new Date().toISOString(),
                automations: [
                    'Validação arquivo final antes de aprovação cliente',
                    'Envio automático de arquivos e legenda'
                ]
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

            // 3. Se passou na validação, executar AUTOMAÇÃO 2
            await this.sendClientApprovalFiles(taskId, taskDetails);
            
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
            // Reverter para status anterior (pode ser "em andamento", "review", etc.)
            const previousStatus = 'em andamento'; // Definir status padrão ou detectar anterior
            
            const updateData = {
                status: previousStatus
            };

            const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                console.log(`🔄 Status da tarefa ${taskId} revertido para: ${previousStatus}`);
                
                // Adicionar comentário explicativo
                await this.addComment(taskId, 
                    `⚠️ AUTOMAÇÃO: Status revertido automaticamente. ` +
                    `Para mover para "Aprovação Cliente", é necessário anexar arquivos no campo "Arquivo Final".`
                );
            }
        } catch (error) {
            console.error('Erro ao reverter status:', error);
        }
    }

    async sendClientApprovalFiles(taskId, taskDetails) {
        try {
            console.log(`📤 Enviando arquivos para aprovação do cliente - Tarefa: ${taskId}`);

            // 1. Coletar campo "legenda"
            const legenda = this.extractLegendaField(taskDetails);
            
            // 2. Coletar arquivos do campo "arquivo final"
            const arquivos = await this.extractArquivoFinalFiles(taskDetails);
            
            // 3. Preparar dados do cliente
            const clienteInfo = this.extractClientInfo(taskDetails);
            
            // 4. Enviar por email
            await this.sendApprovalEmail(taskDetails, legenda, arquivos, clienteInfo);
            
            // 5. Registrar no ClickUp
            await this.addComment(taskId, 
                `✅ AUTOMAÇÃO: Arquivos e legenda enviados para aprovação do cliente automaticamente. ` +
                `${arquivos.length} arquivo(s) enviado(s).`
            );

            console.log(`✅ Envio concluído para tarefa ${taskId}`);
            
        } catch (error) {
            console.error('Erro no envio para cliente:', error);
            
            await this.addComment(taskId, 
                `❌ AUTOMAÇÃO: Erro no envio automático. Favor enviar manualmente. Erro: ${error.message}`
            );
        }
    }

    extractLegendaField(taskDetails) {
        // Buscar campo "legenda" nos campos customizados
        const legendaField = taskDetails.custom_fields?.find(field => 
            field.name?.toLowerCase().includes('legenda') ||
            field.name?.toLowerCase().includes('texto') ||
            field.name?.toLowerCase().includes('copy')
        );

        if (legendaField && legendaField.value) {
            return legendaField.value;
        }

        // Fallback: usar descrição da tarefa
        return taskDetails.description || taskDetails.text_content || '';
    }

    async extractArquivoFinalFiles(taskDetails) {
        const arquivos = [];
        
        try {
            // Buscar anexos da tarefa
            const response = await fetch(`https://api.clickup.com/api/v2/task/${taskDetails.id}/attachment`, { headers });
            
            if (response.ok) {
                const attachments = await response.json();
                
                // Filtrar arquivos "finais"
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
        // Extrair informações do cliente baseado na lista ou campos customizados
        const clienteInfo = {
            nome: 'Cliente',
            email: 'cliente@exemplo.com' // Implementar lógica para extrair email do cliente
        };

        // Tentar extrair da lista
        if (taskDetails.list?.name) {
            clienteInfo.nome = taskDetails.list.name;
        }

        // Tentar extrair email de campos customizados
        const emailField = taskDetails.custom_fields?.find(field => 
            field.name?.toLowerCase().includes('email') ||
            field.name?.toLowerCase().includes('cliente')
        );

        if (emailField && emailField.value) {
            clienteInfo.email = emailField.value;
        }

        return clienteInfo;
    }

    async sendApprovalEmail(taskDetails, legenda, arquivos, clienteInfo) {
        const mailOptions = {
            from: 'rafaelrosaonline@gmail.com',
            to: clienteInfo.email,
            subject: `Aprovação necessária: ${taskDetails.name}`,
            html: `
                <h2>Olá ${clienteInfo.nome}!</h2>
                
                <p>Temos novos materiais para sua aprovação:</p>
                
                <h3>📋 Projeto: ${taskDetails.name}</h3>
                
                ${legenda ? `
                <h3>📝 Legenda/Descrição:</h3>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                    ${legenda}
                </div>
                ` : ''}
                
                <h3>📎 Arquivos para aprovação:</h3>
                <ul>
                    ${arquivos.map(arquivo => `
                        <li>
                            <a href="${arquivo.url}" target="_blank">${arquivo.name}</a>
                            <small> (${arquivo.extension?.toUpperCase()} - ${Math.round(arquivo.size / 1024)}KB)</small>
                        </li>
                    `).join('')}
                </ul>
                
                <p>Por favor, analise os materiais e nos retorne com sua aprovação ou solicitações de ajustes.</p>
                
                <p>Atenciosamente,<br>
                <strong>Equipe Rafael Rosa Marketing</strong></p>
                
                <hr>
                <small>Este email foi enviado automaticamente pelo sistema ClickUp.</small>
            `
        };

        // Enviar email
        await this.emailTransporter.sendMail(mailOptions);
        console.log(`📧 Email enviado para ${clienteInfo.email}`);
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
        // Notificar responsáveis via comentário no ClickUp
        const messages = {
            'ARQUIVO_FINAL_OBRIGATORIO': 
                `🚨 ATENÇÃO: Para mover esta tarefa para "Aprovação Cliente", ` +
                `é obrigatório anexar arquivos no campo "Arquivo Final". ` +
                `Status revertido automaticamente.`
        };

        const message = messages[notificationType] || 'Notificação automática do sistema.';
        
        await this.addComment(taskDetails.id, message);
        
        // Aqui pode adicionar outras formas de notificação (Slack, WhatsApp, etc.)
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`🚀 Servidor de automações ClickUp rodando na porta ${port}`);
            console.log(`📡 Webhook endpoint: http://localhost:${port}/webhook/clickup`);
            console.log(`🧪 Teste endpoint: http://localhost:${port}/test/automation`);
            console.log(`📊 Status: http://localhost:${port}/status`);
        });
    }
}

// Executar se for chamado diretamente
if (require.main === module) {
    const automations = new ClickUpAutomations();
    automations.start();
}

module.exports = ClickUpAutomations;