const fs = require('fs');

// Configurações
const API_TOKEN = 'pk_44278848_FK81OR2OL487GOJYCHJPJ345Z55G6RZ7';
const TEAM_ID = '9010151858';

// Headers para ClickUp API
const headers = {
    'Authorization': API_TOKEN,
    'Content-Type': 'application/json'
};

async function setupWebhook() {
    const WEBHOOK_URL = process.argv[2] || 'https://seu-servidor.com/webhook/clickup';
    
    console.log('🔧 Configurando webhook do ClickUp...');
    console.log(`📡 URL do webhook: ${WEBHOOK_URL}`);
    
    try {
        // 1. Listar webhooks existentes
        console.log('\n📋 Verificando webhooks existentes...');
        const listResponse = await fetch(`https://api.clickup.com/api/v2/team/${TEAM_ID}/webhook`, { headers });
        const existingWebhooks = await listResponse.json();
        
        console.log(`✅ Webhooks existentes: ${existingWebhooks.webhooks?.length || 0}`);
        
        // 2. Remover webhooks antigos se existirem
        if (existingWebhooks.webhooks && existingWebhooks.webhooks.length > 0) {
            console.log('\n🗑️ Removendo webhooks antigos...');
            for (const webhook of existingWebhooks.webhooks) {
                if (webhook.endpoint?.includes('webhook/clickup')) {
                    const deleteResponse = await fetch(`https://api.clickup.com/api/v2/webhook/${webhook.id}`, {
                        method: 'DELETE',
                        headers: headers
                    });
                    
                    if (deleteResponse.ok) {
                        console.log(`   ✅ Webhook removido: ${webhook.id}`);
                    }
                }
            }
        }
        
        // 3. Criar novo webhook
        console.log('\n🚀 Criando novo webhook...');
        const webhookData = {
            endpoint: WEBHOOK_URL,
            events: [
                'taskStatusUpdated',
                'taskUpdated',
                'taskCreated',
                'taskMoved',
                'taskCommentPosted'
            ]
        };
        
        const createResponse = await fetch(`https://api.clickup.com/api/v2/team/${TEAM_ID}/webhook`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(webhookData)
        });
        
        if (createResponse.ok) {
            const newWebhook = await createResponse.json();
            console.log('✅ Webhook criado com sucesso!');
            console.log(`📊 ID: ${newWebhook.id}`);
            console.log(`📡 Endpoint: ${newWebhook.endpoint}`);
            console.log(`🎯 Eventos: ${newWebhook.events.join(', ')}`);
            
            // 4. Salvar configuração
            const config = {
                webhook_id: newWebhook.id,
                webhook_url: newWebhook.endpoint,
                events: newWebhook.events,
                team_id: TEAM_ID,
                created_at: new Date().toISOString()
            };
            
            fs.writeFileSync('webhook-config.json', JSON.stringify(config, null, 2));
            console.log('💾 Configuração salva em webhook-config.json');
            
        } else {
            const error = await createResponse.text();
            console.error('❌ Erro ao criar webhook:', error);
        }
        
    } catch (error) {
        console.error('❌ Erro na configuração:', error);
    }
}

async function testWebhook() {
    console.log('🧪 Testando webhook...');
    
    try {
        // Tentar ler configuração
        if (!fs.existsSync('webhook-config.json')) {
            console.error('❌ Arquivo webhook-config.json não encontrado. Execute a configuração primeiro.');
            return;
        }
        
        const config = JSON.parse(fs.readFileSync('webhook-config.json', 'utf8'));
        
        // Fazer uma mudança de teste em uma tarefa
        // (Este é um exemplo - você pode adaptar conforme necessário)
        console.log(`📡 Webhook ativo: ${config.webhook_url}`);
        console.log(`🆔 ID do webhook: ${config.webhook_id}`);
        console.log(`🎯 Eventos monitorados: ${config.events.join(', ')}`);
        console.log('\n✅ Webhook configurado e pronto para receber eventos!');
        console.log('\n📋 Para testar:');
        console.log('1. Mude o status de uma tarefa no ClickUp para "aprovação cliente"');
        console.log('2. Verifique os logs do servidor de automações');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Execução baseada em argumentos
const command = process.argv[2];

if (command === 'test') {
    testWebhook();
} else if (command === 'setup' || !command) {
    const webhookUrl = process.argv[3] || process.argv[2];
    if (!webhookUrl || webhookUrl === 'setup') {
        console.log('❌ Uso: node setup-webhook.js <URL_DO_WEBHOOK>');
        console.log('Exemplo: node setup-webhook.js https://seu-servidor.herokuapp.com/webhook/clickup');
        process.exit(1);
    }
    setupWebhook();
} else {
    console.log('📚 Comandos disponíveis:');
    console.log('   node setup-webhook.js <URL> - Configurar webhook');
    console.log('   node setup-webhook.js test   - Testar webhook');
}

module.exports = { setupWebhook, testWebhook };