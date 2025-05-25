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

async function fetchTaskDetails(taskId, taskName = 'Unknown') {
    try {
        console.log(`   📄 Coletando detalhes de: ${taskName}`);
        
        // 1. Detalhes completos da tarefa
        const taskResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, { headers });
        const taskData = await taskResponse.json();
        
        // 2. Comentários da tarefa
        const commentsResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/comment`, { headers });
        const commentsData = await commentsResponse.json();
        
        // 3. Anexos da tarefa (se a API permitir)
        let attachmentsData = { attachments: [] };
        try {
            const attachmentsResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, { headers });
            if (attachmentsResponse.ok) {
                attachmentsData = await attachmentsResponse.json();
            }
        } catch (attachError) {
            console.log(`   📎 Anexos não disponíveis para ${taskName}`);
        }
        
        // 4. Time tracking (se disponível)
        let timeTrackingData = { data: [] };
        try {
            const timeResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/time`, { headers });
            if (timeResponse.ok) {
                timeTrackingData = await timeResponse.json();
            }
        } catch (timeError) {
            console.log(`   ⏱️ Time tracking não disponível para ${taskName}`);
        }
        
        return {
            task_details: {
                id: taskData.id,
                name: taskData.name,
                description: taskData.description || '',
                text_content: taskData.text_content || '', // Versão texto da descrição
                status: {
                    status: taskData.status?.status || 'sem status',
                    color: taskData.status?.color || '',
                    type: taskData.status?.type || ''
                },
                assignees: taskData.assignees?.map(a => ({
                    id: a.id,
                    username: a.username,
                    email: a.email,
                    color: a.color,
                    profilePicture: a.profilePicture
                })) || [],
                watchers: taskData.watchers?.map(w => ({
                    id: w.id,
                    username: w.username,
                    email: w.email
                })) || [],
                priority: {
                    priority: taskData.priority?.priority || 'normal',
                    color: taskData.priority?.color || ''
                },
                due_date: taskData.due_date,
                start_date: taskData.start_date,
                time_estimate: taskData.time_estimate,
                time_spent: taskData.time_spent,
                tags: taskData.tags?.map(tag => ({
                    name: tag.name,
                    tag_fg: tag.tag_fg,
                    tag_bg: tag.tag_bg
                })) || [],
                custom_fields: taskData.custom_fields?.map(field => ({
                    id: field.id,
                    name: field.name,
                    type: field.type,
                    value: field.value,
                    required: field.required
                })) || [],
                dependencies: taskData.dependencies || [],
                linked_tasks: taskData.linked_tasks || [],
                team_id: taskData.team_id,
                url: taskData.url,
                permission_level: taskData.permission_level,
                list: {
                    id: taskData.list?.id,
                    name: taskData.list?.name
                },
                project: taskData.project ? {
                    id: taskData.project.id,
                    name: taskData.project.name
                } : null,
                folder: taskData.folder ? {
                    id: taskData.folder.id,
                    name: taskData.folder.name
                } : null,
                space: {
                    id: taskData.space?.id,
                    name: taskData.space?.name
                },
                date_created: taskData.date_created,
                date_updated: taskData.date_updated,
                date_closed: taskData.date_closed,
                creator: {
                    id: taskData.creator?.id,
                    username: taskData.creator?.username,
                    email: taskData.creator?.email,
                    color: taskData.creator?.color
                },
                archived: taskData.archived || false
            },
            
            comments: commentsData.comments?.map(comment => ({
                id: comment.id,
                comment_text: comment.comment_text,
                comment_text_cleaned: comment.comment_text?.replace(/<[^>]*>/g, '') || '', // Remove HTML tags
                user: {
                    id: comment.user?.id,
                    username: comment.user?.username,
                    email: comment.user?.email,
                    color: comment.user?.color
                },
                date: comment.date,
                parent: comment.parent,
                type: comment.type,
                resolved: comment.resolved || false,
                assignees: comment.assignees?.map(a => ({
                    id: a.id,
                    username: a.username
                })) || [],
                reactions: comment.reactions || []
            })) || [],
            
            attachments: attachmentsData.attachments?.map(attachment => ({
                id: attachment.id,
                name: attachment.name,
                url: attachment.url,
                parent: attachment.parent,
                hidden: attachment.hidden || false,
                size: attachment.size,
                total_comments: attachment.total_comments || 0,
                resolved_comments: attachment.resolved_comments || 0,
                date: attachment.date,
                user: {
                    id: attachment.user?.id,
                    username: attachment.user?.username,
                    email: attachment.user?.email
                },
                extension: attachment.extension,
                thumbnail_small: attachment.thumbnail_small,
                thumbnail_medium: attachment.thumbnail_medium,
                thumbnail_large: attachment.thumbnail_large,
                is_folder: attachment.is_folder || false,
                mimetype: attachment.mimetype,
                version: attachment.version
            })) || [],
            
            time_tracking: timeTrackingData.data?.map(entry => ({
                id: entry.id,
                task: entry.task,
                wid: entry.wid,
                user: {
                    id: entry.user?.id,
                    username: entry.user?.username,
                    email: entry.user?.email
                },
                billable: entry.billable,
                start: entry.start,
                end: entry.end,
                time: entry.time,
                source: entry.source,
                date_created: entry.date_created
            })) || []
        };
        
    } catch (error) {
        console.error(`❌ Erro ao buscar detalhes da tarefa ${taskId} (${taskName}):`, error.message);
        return null;
    }
}

async function fetchListTasks(listId, listName, limit = 50) {
    try {
        console.log(`📋 Coletando tarefas da lista: ${listName}`);
        
        // Buscar tarefas com mais detalhes
        const tasksResponse = await fetch(
            `https://api.clickup.com/api/v2/list/${listId}/task?page=0&limit=${limit}&include_closed=false&include_markdown=true`, 
            { headers }
        );
        const tasksData = await tasksResponse.json();
        
        // Buscar detalhes completos para as primeiras tarefas
        const detailedTasks = [];
        const tasksToAnalyze = tasksData.tasks?.slice(0, Math.min(limit, 30)) || []; // Limitar a 30 para não sobrecarregar
        
        for (const task of tasksToAnalyze) {
            const taskDetails = await fetchTaskDetails(task.id, task.name);
            if (taskDetails) {
                detailedTasks.push(taskDetails);
            }
            
            // Pausa para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        return {
            list_info: {
                id: listId,
                name: listName,
                total_tasks: tasksData.tasks?.length || 0,
                analyzed_tasks: detailedTasks.length
            },
            tasks: detailedTasks,
            summary: {
                total_comments: detailedTasks.reduce((sum, task) => sum + task.comments.length, 0),
                total_attachments: detailedTasks.reduce((sum, task) => sum + task.attachments.length, 0),
                total_time_entries: detailedTasks.reduce((sum, task) => sum + task.time_tracking.length, 0),
                tasks_with_description: detailedTasks.filter(task => task.task_details.description).length,
                tasks_with_comments: detailedTasks.filter(task => task.comments.length > 0).length,
                tasks_with_attachments: detailedTasks.filter(task => task.attachments.length > 0).length,
                tasks_with_time_tracking: detailedTasks.filter(task => task.time_tracking.length > 0).length,
                average_comments_per_task: detailedTasks.length > 0 ? 
                    (detailedTasks.reduce((sum, task) => sum + task.comments.length, 0) / detailedTasks.length).toFixed(2) : 0,
                average_attachments_per_task: detailedTasks.length > 0 ? 
                    (detailedTasks.reduce((sum, task) => sum + task.attachments.length, 0) / detailedTasks.length).toFixed(2) : 0
            }
        };
        
    } catch (error) {
        console.error(`❌ Erro ao buscar tarefas da lista ${listName}:`, error.message);
        return null;
    }
}

async function fetchEnhancedClickUpData() {
    console.log('🚀 INICIANDO COLETA COMPLETA DOS DADOS DO CLICKUP...');
    console.log('⏰ Executado em:', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    console.log('📊 Coletando: tarefas, comentários, anexos, time tracking e muito mais...');
    
    try {
        // 1. Dados estruturais básicos
        console.log('\n📁 Coletando estrutura básica...');
        const operacionalResponse = await fetch(`https://api.clickup.com/api/v2/space/${OPERACIONAL_SPACE}/list`, { headers });
        const operacionalData = await operacionalResponse.json();
        
        const clientesResponse = await fetch(`https://api.clickup.com/api/v2/space/${CLIENTES_SPACE}/list`, { headers });
        const clientesData = await clientesResponse.json();
        
        // 2. Dados detalhados das principais listas operacionais
        console.log('\n🎨 Coletando dados completos das listas operacionais...');
        
        const socialMediaDetailed = await fetchListTasks('901408806028', 'Social Media', 40);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const assessoriaDetailed = await fetchListTasks('901408806039', 'Assessoria', 25);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const trafegoDetailed = await fetchListTasks('901408546989', 'Gestão de Tráfego', 15);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sitesDetailed = await fetchListTasks('901408806038', 'Sites', 10);
        
        // 3. Dados dos clientes (sample)
        console.log('\n🏢 Verificando atividade dos clientes...');
        const clientesDetailed = [];
        for (const cliente of clientesData.lists?.slice(0, 3) || []) {
            if (cliente.task_count > 0) {
                const clienteData = await fetchListTasks(cliente.id, cliente.name, 10);
                if (clienteData) {
                    clientesDetailed.push(clienteData);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // 4. Consolidar resultado
        const resultado = {
            timestamp: new Date().toISOString(),
            last_updated: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            collection_scope: {
                social_media_tasks: socialMediaDetailed?.list_info.analyzed_tasks || 0,
                assessoria_tasks: assessoriaDetailed?.list_info.analyzed_tasks || 0,
                trafego_tasks: trafegoDetailed?.list_info.analyzed_tasks || 0,
                sites_tasks: sitesDetailed?.list_info.analyzed_tasks || 0,
                clientes_lists: clientesDetailed.length,
                total_tasks_analyzed: [socialMediaDetailed, assessoriaDetailed, trafegoDetailed, sitesDetailed, ...clientesDetailed]
                    .filter(Boolean)
                    .reduce((sum, list) => sum + list.list_info.analyzed_tasks, 0)
            },
            
            // Estrutura básica
            estrutura: {
                operacional: operacionalData,
                clientes: clientesData
            },
            
            // Dados detalhados por área
            operacional_detalhado: {
                social_media: socialMediaDetailed,
                assessoria: assessoriaDetailed,
                gestao_trafego: trafegoDetailed,
                sites: sitesDetailed
            },
            
            clientes_detalhado: clientesDetailed,
            
            // Estatísticas globais
            stats_globais: {
                total_listas_operacional: operacionalData.lists?.length || 0,
                total_listas_clientes: clientesData.lists?.length || 0,
                total_tasks_analyzed: [socialMediaDetailed, assessoriaDetailed, trafegoDetailed, sitesDetailed, ...clientesDetailed]
                    .filter(Boolean)
                    .reduce((sum, list) => sum + list.list_info.analyzed_tasks, 0),
                total_comments: [socialMediaDetailed, assessoriaDetailed, trafegoDetailed, sitesDetailed, ...clientesDetailed]
                    .filter(Boolean)
                    .reduce((sum, list) => sum + list.summary.total_comments, 0),
                total_attachments: [socialMediaDetailed, assessoriaDetailed, trafegoDetailed, sitesDetailed, ...clientesDetailed]
                    .filter(Boolean)
                    .reduce((sum, list) => sum + list.summary.total_attachments, 0),
                total_time_entries: [socialMediaDetailed, assessoriaDetailed, trafegoDetailed, sitesDetailed, ...clientesDetailed]
                    .filter(Boolean)
                    .reduce((sum, list) => sum + list.summary.total_time_entries, 0)
            }
        };
        
        // 5. Resumo executivo super inteligente
        const resumoExecutivo = {
            timestamp: resultado.timestamp,
            last_updated: resultado.last_updated,
            
            // Overview geral
            overview: {
                total_tasks_analyzed: resultado.collection_scope.total_tasks_analyzed,
                total_comments: resultado.stats_globais.total_comments,
                total_attachments: resultado.stats_globais.total_attachments,
                total_time_entries: resultado.stats_globais.total_time_entries,
                most_active_area: socialMediaDetailed ? 'Social Media' : 'Assessoria'
            },
            
            // Insights por área
            areas_insights: {
                social_media: socialMediaDetailed ? {
                    tasks_analyzed: socialMediaDetailed.list_info.analyzed_tasks,
                    comments_total: socialMediaDetailed.summary.total_comments,
                    attachments_total: socialMediaDetailed.summary.total_attachments,
                    avg_comments_per_task: socialMediaDetailed.summary.average_comments_per_task,
                    collaboration_level: socialMediaDetailed.summary.total_comments > 50 ? 'Alto' : 
                                        socialMediaDetailed.summary.total_comments > 20 ? 'Médio' : 'Baixo',
                    most_commented_task: socialMediaDetailed.tasks
                        .sort((a, b) => b.comments.length - a.comments.length)[0]?.task_details.name || 'N/A',
                    tasks_needing_attention: socialMediaDetailed.tasks
                        .filter(task => task.comments.length === 0 && task.task_details.description === '')
                        .slice(0, 5)
                        .map(task => task.task_details.name)
                } : null,
                
                assessoria: assessoriaDetailed ? {
                    tasks_analyzed: assessoriaDetailed.list_info.analyzed_tasks,
                    comments_total: assessoriaDetailed.summary.total_comments,
                    attachments_total: assessoriaDetailed.summary.total_attachments,
                    collaboration_level: assessoriaDetailed.summary.total_comments > 30 ? 'Alto' : 
                                        assessoriaDetailed.summary.total_comments > 10 ? 'Médio' : 'Baixo'
                } : null,
                
                gestao_trafego: trafegoDetailed ? {
                    tasks_analyzed: trafegoDetailed.list_info.analyzed_tasks,
                    comments_total: trafegoDetailed.summary.total_comments,
                    attachments_total: trafegoDetailed.summary.total_attachments
                } : null,
                
                sites: sitesDetailed ? {
                    tasks_analyzed: sitesDetailed.list_info.analyzed_tasks,
                    status: sitesDetailed.list_info.analyzed_tasks > 0 ? 'Ativo' : 'Inativo'
                } : null
            },
            
            // Alertas e recomendações
            alerts: {
                areas_inativas: [
                    sitesDetailed?.list_info.analyzed_tasks === 0 ? 'Sites' : null,
                    trafegoDetailed?.list_info.analyzed_tasks < 5 ? 'Gestão de Tráfego (baixa atividade)' : null
                ].filter(Boolean),
                
                tasks_without_interaction: [socialMediaDetailed, assessoriaDetailed, trafegoDetailed]
                    .filter(Boolean)
                    .flatMap(area => area.tasks.filter(task => 
                        task.comments.length === 0 && 
                        task.task_details.description === '' &&
                        task.task_details.assignees.length === 0
                    ))
                    .slice(0, 10)
                    .map(task => ({
                        area: task.task_details.list.name,
                        task_name: task.task_details.name,
                        created_date: task.task_details.date_created
                    })),
                
                high_collaboration_tasks: [socialMediaDetailed, assessoriaDetailed]
                    .filter(Boolean)
                    .flatMap(area => area.tasks.filter(task => task.comments.length >= 5))
                    .slice(0, 5)
                    .map(task => ({
                        area: task.task_details.list.name,
                        task_name: task.task_details.name,
                        comments_count: task.comments.length
                    }))
            },
            
            // Equipe ativa
            equipe_ativa: {
                total_membros: 3,
                membros: ['Rafael Rosa', 'Vanessa Wernke da Rosa', 'Cristoffer Martins']
            }
        };
        
        // 6. Salvar arquivos
        console.log('\n💾 Salvando dados completos...');
        fs.writeFileSync('clickup-data-complete.json', JSON.stringify(resultado, null, 2));
        fs.writeFileSync('clickup-enhanced-summary.json', JSON.stringify(resumoExecutivo, null, 2));
        
        // Manter compatibilidade com arquivo antigo
        const basicSummary = {
            timestamp: resultado.timestamp,
            last_updated: resultado.last_updated,
            stats: {
                total_listas_operacional: resultado.stats_globais.total_listas_operacional,
                total_listas_clientes: resultado.stats_globais.total_listas_clientes,
                tarefas_social_media: socialMediaDetailed?.list_info.analyzed_tasks || 0,
                tarefas_assessoria: assessoriaDetailed?.list_info.analyzed_tasks || 0,
                tarefas_trafego: trafegoDetailed?.list_info.analyzed_tasks || 0,
                total_tarefas_ativas: resultado.stats_globais.total_tasks_analyzed
            },
            listas_operacional: operacionalData.lists?.map(list => ({
                id: list.id,
                name: list.name,
                task_count: list.task_count || 0,
                status: list.status
            })) || [],
            listas_clientes: clientesData.lists?.map(list => ({
                id: list.id,
                name: list.name,
                task_count: list.task_count || 0
            })) || [],
            equipe_ativa: {
                total_membros: 3,
                membros: ['Rafael Rosa', 'Vanessa Wernke da Rosa', 'Cristoffer Martins']
            }
        };
        fs.writeFileSync('clickup-summary.json', JSON.stringify(basicSummary, null, 2));
        
        console.log('\n✅ COLETA COMPLETA FINALIZADA COM SUCESSO!');
        console.log(`📊 Tarefas analisadas: ${resultado.collection_scope.total_tasks_analyzed}`);
        console.log(`💬 Comentários coletados: ${resultado.stats_globais.total_comments}`);
        console.log(`📎 Anexos encontrados: ${resultado.stats_globais.total_attachments}`);
        console.log(`⏱️ Registros de tempo: ${resultado.stats_globais.total_time_entries}`);
        console.log(`⏰ Última atualização: ${resultado.last_updated}`);
        console.log(`📄 Arquivos criados:`);
        console.log(`   - clickup-data-complete.json (${JSON.stringify(resultado).length} chars)`);
        console.log(`   - clickup-enhanced-summary.json (${JSON.stringify(resumoExecutivo).length} chars)`);
        console.log(`   - clickup-summary.json (compatibilidade)`);
        
        return resultado;
        
    } catch (error) {
        console.error('❌ ERRO na coleta completa:', error);
        
        // Criar arquivo de erro
        const errorResult = {
            timestamp: new Date().toISOString(),
            last_updated: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
            error: error.message,
            status: "ERRO na execução completa"
        };
        
        fs.writeFileSync('clickup-data-complete.json', JSON.stringify(errorResult, null, 2));
        fs.writeFileSync('clickup-enhanced-summary.json', JSON.stringify(errorResult, null, 2));
        throw error;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fetchEnhancedClickUpData();
}

module.exports = fetchEnhancedClickUpData;