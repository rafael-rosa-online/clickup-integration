const fs = require('fs');

// Configurações
const API_TOKEN = 'pk_44278848_FK81OR2OL487GOJYCHJPJ345Z55G6RZ7';

// Headers para autenticação
const headers = {
    'Authorization': API_TOKEN,
    'Content-Type': 'application/json'
};

// IDs das listas principais
const LISTAS = {
    'social-media': '901408806028',
    'assessoria': '901408806039', 
    'gestao-trafego': '901408546989',
    'sites': '901408806038'
};

async function criarTarefa(listId, taskData) {
    console.log(`🚀 Criando tarefa na lista ${listId}...`);
    
    try {
        const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Tarefa criada com sucesso!');
        console.log(`📋 ID: ${result.id}`);
        console.log(`📝 Nome: ${result.name}`);
        console.log(`🔗 URL: ${result.url}`);
        
        return result;
        
    } catch (error) {
        console.error('❌ Erro ao criar tarefa:', error);
        throw error;
    }
}

// Função para criar tarefas via argumentos da linha de comando
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
🎯 CRIAR TAREFA NO CLICKUP

Uso: node create-task.js <lista> "<nome>" [prioridade] [responsavel]

Listas disponíveis:
- social-media    (Social Media)
- assessoria      (Assessoria) 
- gestao-trafego  (Gestão de Tráfego)
- sites           (Sites)

Exemplos:
node create-task.js social-media "Criar post Instagram"
node create-task.js assessoria "Reunião cliente X" high "vanessa"
node create-task.js gestao-trafego "Análise campanhas Google Ads" normal
        `);
        return;
    }
    
    const [lista, nome, prioridade = 'normal', responsavel] = args;
    
    if (!LISTAS[lista]) {
        console.error(`❌ Lista "${lista}" não encontrada. Use: ${Object.keys(LISTAS).join(', ')}`);
        return;
    }
    
    // Estrutura da tarefa
    const taskData = {
        name: nome,
        description: `Tarefa criada automaticamente via Claude em ${new Date().toLocaleString('pt-BR')}`,
        priority: prioridade === 'high' ? 1 : prioridade === 'urgent' ? 2 : prioridade === 'low' ? 4 : 3,
        status: 'to do'
    };
    
    // Adicionar responsável se especificado
    if (responsavel) {
        // IDs dos usuários (baseado nos dados coletados)
        const usuarios = {
            'rafael': 44278848,
            'vanessa': 62632888, 
            'cristoffer': 88315023
        };
        
        if (usuarios[responsavel.toLowerCase()]) {
            taskData.assignees = [usuarios[responsavel.toLowerCase()]];
        }
    }
    
    try {
        const resultado = await criarTarefa(LISTAS[lista], taskData);
        
        // Salvar log da criação
        const log = {
            timestamp: new Date().toISOString(),
            acao: 'tarefa_criada',
            lista: lista,
            tarefa: {
                id: resultado.id,
                nome: resultado.name,
                url: resultado.url
            }
        };
        
        // Adicionar ao log de atividades
        let logs = [];
        if (fs.existsSync('activity-log.json')) {
            logs = JSON.parse(fs.readFileSync('activity-log.json', 'utf8'));
        }
        logs.push(log);
        fs.writeFileSync('activity-log.json', JSON.stringify(logs, null, 2));
        
        console.log('📝 Log de atividade atualizado');
        
    } catch (error) {
        console.error('❌ Falha na criação:', error.message);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { criarTarefa, LISTAS };