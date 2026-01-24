// Dashboard JavaScript - Gráficos e Visualizações

// Configuração global dos gráficos
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = '#666';

// Variáveis globais
let interesseChart, formatoChart, crescimentoChart;
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
    // Mostra o total (com dados demo incluídos)
    const totalComDemo = stats.total;
    document.getElementById('totalRespostas').textContent = totalComDemo;

    // Atualiza taxa de resposta se o elemento existir
    const taxaElement = document.getElementById('taxaResposta');
    if (taxaElement) {
        taxaElement.textContent = '100%';
    }

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

// Criar gráfico de crescimento de inscritos
function criarGraficoCrescimento() {
    const canvas = document.getElementById('crescimentoChart');
    if (!canvas) return; // Só cria se o canvas existir (página dashboard.html)

    const ctx = canvas.getContext('2d');

    if (crescimentoChart) {
        crescimentoChart.destroy();
    }

    // Agrupar respostas por data
    const respostasPorDia = {};

    respostas.forEach(resposta => {
        const data = new Date(resposta.timestamp);
        const dia = data.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });

        if (!respostasPorDia[dia]) {
            respostasPorDia[dia] = 0;
        }
        respostasPorDia[dia]++;
    });

    // Criar array acumulativo
    const dias = Object.keys(respostasPorDia);
    let acumulado = 0;
    const dadosAcumulados = dias.map(dia => {
        acumulado += respostasPorDia[dia];
        return acumulado;
    });

    crescimentoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dias,
            datasets: [{
                label: 'Total de Inscritos',
                data: dadosAcumulados,
                backgroundColor: cores.verde,
                borderColor: cores.verdeEscuro,
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Total: ${context.parsed.y} inscritos`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Número de Inscritos',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Data',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Atualizar tabela de participantes (últimas 5 respostas ou todas)
function atualizarTabela() {
    const tbody = document.getElementById('participantesBody');

    if (respostas.length === 0) {
        const colspan = tbody.closest('table').querySelectorAll('thead th').length;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">Aguardando respostas...</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    // Se for a tabela compacta (2 colunas), mostra últimas 5
    const isCompactTable = tbody.closest('table').classList.contains('table-compact');

    if (isCompactTable) {
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
    } else {
        // Mostra todas as respostas (tabela completa no dashboard.html)
        respostas.slice().reverse().forEach((resposta, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${respostas.length - index}</td>
                <td>${resposta.nome}</td>
                <td>${resposta.email}</td>
                <td>${resposta.interesse}</td>
                <td>${resposta.formato_participacao}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Atualizar todos os dados
function atualizarDashboard() {
    respostas = carregarDados();
    const stats = processarDados();

    atualizarEstatisticas(stats);
    criarGraficoInteresse(stats);
    criarGraficoFormato(stats);
    criarGraficoCrescimento();
    atualizarTabela();
}

// Exportar para CSV
function exportarCSV() {
    const headers = ['Nome', 'E-mail', 'Interesse', 'Formato de Participação', 'Data'];
    const linhas = respostas.map(r => [
        r.nome,
        r.email,
        r.interesse,
        r.formato_participacao,
        new Date(r.timestamp).toLocaleString('pt-PT')
    ]);

    let csvContent = headers.join(',') + '\n';
    linhas.forEach(linha => {
        csvContent += linha.map(campo => `"${campo}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resultados_inquerito.csv';
    link.click();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    setTimeout(() => {
        atualizarDashboard();
    }, 100);

    // Botão de atualizar (se existir)
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            atualizarDashboard();
            refreshBtn.innerHTML = '<i class="fas fa-check"></i> Atualizado!';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Dados';
            }, 2000);
        });
    }

    // Botões de exportação (se existirem)
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportarCSV);
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            alert('Use a função de impressão do navegador (Ctrl+P) e salve como PDF.');
            window.print();
        });
    }

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportarCSV);
    }

    // Atualização automática a cada 3 segundos para refletir mudanças em tempo real
    setInterval(atualizarDashboard, 3000);
});
