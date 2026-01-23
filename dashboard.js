// Dashboard JavaScript - Gráficos e Visualizações

// Configuração global dos gráficos
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = '#666';

// Variáveis globais
let interesseChart, formatoChart;
let respostas = [];

// Paleta de cores profissional
const cores = {
    verde: '#26A69A',
    verdeEscuro: '#00897B',
    azul: '#5C6BC0',
    roxo: '#7E57C2',
    rosa: '#EC407A',
    laranja: '#FF7043',
    amarelo: '#FFCA28',
    ciano: '#26C6DA'
};

// Dados de demonstração permanentes (aparecem sempre)
function gerarDadosDemonstracao() {
    return [
        {
            nome: 'João Silva',
            email: 'joao.silva@exemplo.com',
            interesse: 'Networking',
            formato_participacao: 'Presencial',
            timestamp: '2026-01-20T10:30:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Maria Santos',
            email: 'maria.santos@exemplo.com',
            interesse: 'Conhecimento',
            formato_participacao: 'Online',
            timestamp: '2026-01-20T11:15:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Pedro Costa',
            email: 'pedro.costa@exemplo.com',
            interesse: 'Oportunidades',
            formato_participacao: 'Hibrido',
            timestamp: '2026-01-20T14:20:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Ana Ferreira',
            email: 'ana.ferreira@exemplo.com',
            interesse: 'Inovacao',
            formato_participacao: 'Presencial',
            timestamp: '2026-01-21T09:45:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Carlos Mendes',
            email: 'carlos.mendes@exemplo.com',
            interesse: 'Networking',
            formato_participacao: 'Online',
            timestamp: '2026-01-21T16:30:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Sofia Rodrigues',
            email: 'sofia.rodrigues@exemplo.com',
            interesse: 'Conhecimento',
            formato_participacao: 'Presencial',
            timestamp: '2026-01-22T08:00:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Miguel Alves',
            email: 'miguel.alves@exemplo.com',
            interesse: 'Oportunidades',
            formato_participacao: 'Hibrido',
            timestamp: '2026-01-22T13:15:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Teresa Martins',
            email: 'teresa.martins@exemplo.com',
            interesse: 'Inovacao',
            formato_participacao: 'Online',
            timestamp: '2026-01-22T15:45:00.000Z',
            isDemoData: true
        }
    ];
}

// Carregar dados do localStorage e mesclar com dados de demonstração
function carregarDados() {
    const dadosDemo = gerarDadosDemonstracao();
    const dadosArmazenados = localStorage.getItem('surveyResponses');

    if (dadosArmazenados) {
        const dadosReais = JSON.parse(dadosArmazenados);
        // Mescla dados de demonstração com dados reais
        respostas = [...dadosDemo, ...dadosReais];
    } else {
        // Se não houver dados reais, usa apenas os dados de demonstração
        respostas = dadosDemo;
    }

    return respostas;
}

// Processar dados para estatísticas
function processarDados() {
    const stats = {
        total: respostas.length,
        interesse: {},
        formato: {}
    };

    respostas.forEach(resposta => {
        // Contar interesses
        const interesse = resposta.interesse || 'Não especificado';
        stats.interesse[interesse] = (stats.interesse[interesse] || 0) + 1;

        // Contar formatos
        const formato = resposta.formato_participacao || 'Não especificado';
        stats.formato[formato] = (stats.formato[formato] || 0) + 1;
    });

    return stats;
}

// Atualizar estatísticas resumidas
function atualizarEstatisticas(stats) {
    // Conta quantas respostas são reais (não de demonstração)
    const respostasReais = respostas.filter(r => !r.isDemoData).length;
    const totalComDemo = stats.total;

    // Mostra o total (com dados demo incluídos)
    document.getElementById('totalRespostas').textContent = totalComDemo;

    const agora = new Date();
    const horaAtual = agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('ultimaAtualizacao').textContent = horaAtual;
}

// Criar gráfico de interesse
function criarGraficoInteresse(stats) {
    const ctx = document.getElementById('interesseChart').getContext('2d');

    if (interesseChart) {
        interesseChart.destroy();
    }

    const labels = Object.keys(stats.interesse);
    const data = Object.values(stats.interesse);
    const backgroundColors = [cores.verde, cores.azul, cores.roxo, cores.rosa];

    interesseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Criar gráfico de formato
function criarGraficoFormato(stats) {
    const ctx = document.getElementById('formatoChart').getContext('2d');

    if (formatoChart) {
        formatoChart.destroy();
    }

    const labels = Object.keys(stats.formato);
    const data = Object.values(stats.formato);
    const backgroundColors = [cores.verdeEscuro, cores.laranja, cores.ciano];

    formatoChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Atualizar tabela de participantes (últimas 5 respostas)
function atualizarTabela() {
    const tbody = document.getElementById('participantesBody');

    if (respostas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="empty-state">Aguardando respostas...</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    // Mostra apenas as últimas 5 respostas
    const ultimasRespostas = respostas.slice(-5).reverse();
    ultimasRespostas.forEach((resposta) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${resposta.nome}</td>
            <td>${resposta.interesse}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Atualizar todos os dados
function atualizarDashboard() {
    respostas = carregarDados();
    const stats = processarDados();

    atualizarEstatisticas(stats);
    criarGraficoInteresse(stats);
    criarGraficoFormato(stats);
    atualizarTabela();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    setTimeout(() => {
        atualizarDashboard();
    }, 100);

    // Atualização automática a cada 3 segundos para refletir mudanças em tempo real
    setInterval(atualizarDashboard, 3000);
});
