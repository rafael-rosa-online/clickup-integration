const ClickUpWhatsAppAutomations = require('./clickup-whatsapp-automations');

// Script de teste para as automações WhatsApp
async function testWhatsAppAutomations() {
    console.log('🧪 INICIANDO TESTES DAS AUTOMAÇÕES CLICKUP + WHATSAPP\n');
    
    const automations = new ClickUpWhatsAppAutomations();
    
    // Dados de teste
    const testTaskId = '86b542v8t'; // ID de uma tarefa real do seu ClickUp
    
    console.log('1️⃣ Testando conexão WhatsApp...');
    
    // Aguardar um pouco para WhatsApp conectar
    setTimeout(async () => {
        try {
            if (automations.whatsapp?.info?.connected) {
                console.log('✅ WhatsApp conectado!');
            } else {
                console.log('⚠️ WhatsApp ainda não conectado - aguarde QR Code');
            }
        } catch (error) {
            console.log('❌ Erro na conexão WhatsApp:', error.message);
        }
    }, 5000);
    
    console.log('\n2️⃣ Testando busca de detalhes da tarefa...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            console.log('✅ Detalhes da tarefa obtidos com sucesso');
            console.log(`   📋 Nome: ${taskDetails.name}`);
            console.log(`   📊 Status: ${taskDetails.status?.status || 'N/A'}`);
            console.log(`   📍 Lista: ${taskDetails.list?.name || 'N/A'}`);
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
                console.log(`   📄 Prévia: ${legenda.substring(0, 100)}...`);
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
    
    console.log('\n6️⃣ Testando identificação de cliente...');
    
    try {
        const taskDetails = await automations.getTaskDetails(testTaskId);
        if (taskDetails) {
            const clienteInfo = automations.extractClientInfo(taskDetails);
            console.log(`   👤 Cliente detectado: ${clienteInfo.nome}`);
            
            // Testar busca de grupo
            const groupInfo = automations.findGroupForClient(clienteInfo.nome);
            if (groupInfo) {
                console.log(`   📱 Grupo WhatsApp: ${groupInfo.name} (${groupInfo.participants} participantes)`);
            } else {
                console.log(`   ⚠️ Grupo WhatsApp não encontrado para "${clienteInfo.nome}"`);
            }
        }
    } catch (error) {
        console.error('❌ Erro na identificação de cliente:', error.message);
    }
    
    console.log('\n7️⃣ Listando grupos WhatsApp disponíveis...');
    
    setTimeout(() => {
        try {
            const grupos = automations.gruposWhatsApp;
            console.log(`   📱 Total de grupos mapeados: ${Object.keys(grupos).length}`);
            
            Object.entries(grupos).forEach(([cliente, grupo]) => {
                console.log(`   👤 ${cliente} -> 📱 ${grupo.name}`);
            });
            
            if (Object.keys(grupos).length === 0) {
                console.log('   ⚠️ Nenhum grupo mapeado ainda. Aguarde a conexão WhatsApp...');
            }
        } catch (error) {
            console.error('❌ Erro ao listar grupos:', error.message);
        }
    }, 3000);
    
    console.log('\n8️⃣ Aguardando conexão WhatsApp...');
    console.log('📱 Se aparecer QR Code, escaneie com seu WhatsApp!');
    
    // Aguardar um tempo para conexão WhatsApp
    setTimeout(() => {
        console.log('\n✅ TESTES BÁSICOS CONCLUÍDOS!');
        console.log('\n📋 PRÓXIMOS PASSOS:');
        console.log('1. ✅ Conectar WhatsApp (escanear QR Code)');
        console.log('2. ✅ Verificar grupos mapeados em /whatsapp/groups');
        console.log('3. ✅ Configurar webhook com: node setup-webhook.js <URL>');
        console.log('4. ✅ Testar envio: /test/whatsapp');
        console.log('5. ✅ Testar fluxo completo no ClickUp');
        
        console.log('\n🧪 COMANDOS DE TESTE:');
        console.log('• Status: curl http://localhost:3000/status');
        console.log('• Grupos: curl http://localhost:3000/whatsapp/groups');
        console.log('• Teste envio: curl -X POST http://localhost:3000/test/whatsapp \\');
        console.log('    -H "Content-Type: application/json" \\');
        console.log('    -d \'{"taskId": "86b542v8t", "groupName": "Nome do Grupo"}\'');
        
        if (!process.argv.includes('--no-exit')) {
            console.log('\n👋 Mantendo servidor rodando para testes...');
            console.log('📡 Acesse http://localhost:3000/status para verificar status');
        }
    }, 10000);
}

// Função para testar servidor WhatsApp
function testWhatsAppServer() {
    const automations = new ClickUpWhatsAppAutomations();
    
    console.log('🚀 Servidor WhatsApp + ClickUp iniciado...');
    console.log('📡 Endpoints disponíveis:');
    console.log('  • http://localhost:3000/status');
    console.log('  • http://localhost:3000/whatsapp/groups');
    console.log('  • http://localhost:3000/test/whatsapp');
    console.log('  • http://localhost:3000/webhook/clickup');
    
    console.log('\n📱 AGUARDANDO CONEXÃO WHATSAPP...');
    console.log('🔍 Procure por QR Code no terminal e escaneie!');
    
    automations.start(3000);
}

// Função para testar envio específico
async function testSendToGroup() {
    const taskId = process.argv[3] || '86b542v8t';
    const groupName = process.argv[4] || 'teste';
    
    console.log(`🧪 Testando envio específico:`);
    console.log(`   📋 Tarefa: ${taskId}`);
    console.log(`   📱 Grupo: ${groupName}`);
    
    try {
        const response = await fetch('http://localhost:3000/test/whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId: taskId,
                groupName: groupName
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Teste de envio concluído:', result);
        } else {
            console.log('❌ Erro no teste:', result);
        }
        
    } catch (error) {
        console.error('❌ Erro na requisição:', error.message);
        console.log('💡 Certifique-se que o servidor está rodando: npm start');
    }
}

// Execução baseada em argumentos
const command = process.argv[2];

if (command === 'server') {
    testWhatsAppServer();
} else if (command === 'send') {
    testSendToGroup();
} else if (command === 'help') {
    console.log('📚 Comandos disponíveis:');
    console.log('  node test-whatsapp-automations.js        - Executar testes básicos');
    console.log('  node test-whatsapp-automations.js server - Iniciar servidor de testes');
    console.log('  node test-whatsapp-automations.js send <taskId> <groupName> - Testar envio específico');
    console.log('  node test-whatsapp-automations.js help   - Mostrar esta ajuda');
} else {
    testWhatsAppAutomations();
}

module.exports = { testWhatsAppAutomations, testWhatsAppServer, testSendToGroup };