const fs = require('fs');

// Configurações
const API_TOKEN = 'pk_44278848_FK81OR2OL487GOJYCHJPJ345Z55G6RZ7';
const TEAM_ID = '9010151858';
const OPERACIONAL_SPACE = '90142603854';
const CLIENTES_SPACE = '90141554777';

// Headers para autenticação
const headers = {
    'Authorization': API_TOKEN,
    'Content-Type': 'application/json'
};

async function fetchClickUpData() {
    console.log('🚀 Iniciando busca de dados do ClickUp...');
    
    try {
        // 1. Listas do OPERACIONAL
        const operacionalResponse = await fetch(`https://api.clickup.com/api/v2/space/${OPERACIONAL_SPACE}/list`, { headers });
        const operacionalData = await operacionalResponse.json();
        
        // 2. Listas dos CLIENTES  
        const clientesResponse = await fetch(`https://api.clickup.com/api/v2/space/${CLIENTES_SPACE}/list`, { headers });
        const clientesData = await clientesResponse.json();
        
        // 3. Atividade recente (Social Media - mais ativa)
        const atividadeResponse = await fetch(`https://api.clickup.com/api/v2/list/901408806028/task?page=0&limit=10`, { headers });
        const atividadeData = await atividadeResponse.json();
        
        // 4. Resumo geral (Assessoria)
        const resumoResponse = await fetch(`https://api.clickup.com/api/v2/list/901408806039/task?page=0&limit=5`, { headers });
        const resumoData = await resumoResponse.json();
        
        // 5. Gestão de Tráfego
        const trafegoResponse = await fetch(`https://api.clickup.com/api/v2/list/901408546989/task?page=0&limit=5`, { headers });
        const trafegoData = await trafegoResponse.json();
        
        // Resultado consolidado
        const resultado = {
            timestamp: new Date().toISOString(),
            last_updated: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            operacional: operacionalData,
            clientes: clientesData,
            atividade_recente: atividadeData,
            resumo_geral: resumoData,
            gestao_trafego: trafegoData,
            stats: {
                total_listas_operacional: operacionalData.lists?.length || 0,
                total_listas_clientes: clientesData.lists?.length || 0,
                tarefas_social_media: atividadeData.tasks?.length || 0,
                tarefas_assessoria: resumoData.tasks?.length || 0,
                tarefas_trafego: trafegoData.tasks?.length || 0,
                total_tarefas_ativas: (atividadeData.tasks?.length || 0) + (resumoData.tasks?.length || 0) + (trafegoData.tasks?.length || 0)
            }
        };
        
        // Salvar no arquivo JSON
        fs.writeFileSync('clickup-data.json', JSON.stringify(resultado, null, 2));
        
        console.log('✅ Dados coletados com sucesso!');
        console.log(`📊 Stats: ${JSON.stringify(resultado.stats, null, 2)}`);
        console.log(`⏰ Última atualização: ${resultado.last_updated}`);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
        throw error;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fetchClickUpData();
}

module.exports = fetchClickUpData;