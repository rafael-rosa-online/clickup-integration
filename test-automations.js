const ClickUpAutomations = require('./clickup-automations');

// Script de teste para as automações
async function testAutomations() {
    console.log('🧪 INICIANDO TESTES DAS AUTOMAÇÕES CLICKUP\n');
    
    const automations = new ClickUpAutomations();
    
    // Dados de teste
    const testTaskId = '86b542v8t'; // ID de uma tarefa real do seu ClickUp
    
    console.log('1️⃣ Testando validação de arquivo final...');
    
    // Simular evento de mudança de status para "aprovação cliente"
    const mockEvent = {
        event: 'taskStatusUpdated',
        task_id: testTaskId,
        history_items: [{
            field: 'status',
            after: { status: 'aprovação cliente' }
        }]
    };
    
    try {
        await automations.handleStatusChange(mockEvent);
        console.log('✅ Teste de validação concluído');
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
    }
    
    console.log('\n2️⃣ Testando busca de detalhes da tarefa...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            console.log('✅ Detalhes da tarefa obtidos com sucesso');
            console.log(`   📋 Nome: ${taskDetails.name}`);
            console.log(`   📊 Status: ${taskDetails.status?.status || 'N/A'}`);
            console.log(`   👥 Responsáveis: ${taskDetails.assignees?.length || 0}`);
            console.log(`   📎 Campos customizados: ${taskDetails.custom_fields?.length || 0}`);
        } else {
            console.log('⚠️ Não foi possível obter detalhes da tarefa');
        }
    } catch (error) {
        console.error('❌ Erro ao buscar detalhes:', error.message);
    }
    
    console.log('\n3️⃣ Testando verificação de arquivo final...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            const hasArquivoFinal = await automations.checkArquivoFinalField(taskDetails);
            console.log(`   📎 Campo "arquivo final" válido: ${hasArquivoFinal ? '✅ SIM' : '❌ NÃO'}`);
        }
    } catch (error) {
        console.error('❌ Erro na verificação:', error.message);
    }
    
    console.log('\n4️⃣ Testando extração de legenda...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            const legenda = automations.extractLegendaField(taskDetails);
            console.log(`   📝 Legenda encontrada: ${legenda ? '✅ SIM' : '❌ NÃO'}`);
            if (legenda) {
                console.log(`   📄 Conteúdo: ${legenda.substring(0, 100)}...`);
            }
        }
    } catch (error) {
        console.error('❌ Erro na extração:', error.message);
    }
    
    console.log('\n5️⃣ Testando extração de arquivos...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            const arquivos = await automations.extractArquivoFinalFiles(taskDetails);
            console.log(`   📎 Arquivos encontrados: ${arquivos.length}`);
            arquivos.forEach((arquivo, index) => {
                console.log(`   ${index + 1}. ${arquivo.name} (${arquivo.extension})`);
            });
        }
    } catch (error) {
        console.error('❌ Erro na extração de arquivos:', error.message);
    }
    
    console.log('\n6️⃣ Testando extração de info do cliente...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            const clienteInfo = automations.extractClientInfo(taskDetails);
            console.log(`   👤 Cliente: ${clienteInfo.nome}`);
            console.log(`   📧 Email: ${clienteInfo.email}`);
        }
    } catch (error) {
        console.error('❌ Erro na extração de cliente:', error.message);
    }
    
    console.log('\n✅ TESTES CONCLUÍDOS!');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Verificar se todos os testes passaram');
    console.log('2. Ajustar configurações se necessário');
    console.log('3. Fazer deploy do servidor');
    console.log('4. Configurar webhook com: node setup-webhook.js <URL>');
    console.log('5. Testar em produção com tarefas reais');
    
    process.exit(0);
}

// Função para testar webhook localmente
function testWebhookLocally() {
    const automations = new ClickUpAutomations();
    
    console.log('🚀 Servidor de teste iniciado...');
    console.log('📡 Teste webhook em: http://localhost:3000/test/automation');
    console.log('📊 Status em: http://localhost:3000/status');
    console.log('\n🧪 Para testar via curl:');
    console.log('curl -X POST http://localhost:3000/test/automation \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"taskId": "86b542v8t", "newStatus": "aprovação cliente"}\'');
    
    automations.start(3000);
}

// Execução baseada em argumentos
const command = process.argv[2];

if (command === 'server') {
    testWebhookLocally();
} else {
    testAutomations();
}

module.exports = { testAutomations, testWebhookLocally };