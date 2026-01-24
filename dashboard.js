// Dashboard JavaScript - Gráficos e Visualizações

// Configuração global dos gráficos
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = '#666';

// Variáveis globais
let praticaSustChart, travaoChart, emissoesChart, contribuiChart, futuroChart, crescimentoChart;
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
            pratica_sustentabilidade: 'Exigencia_internacional',
            travao_sustentabilidade: 'Falta_lideranca',
            emissoes_angola: 'Outras_prioridades',
            contribui_emissoes: 'Transito_transportes',
            futuro_empresas: 'Perder_competitividade',
            timestamp: '2026-01-20T10:30:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Maria Santos',
            pratica_sustentabilidade: 'Conviccao_estrategica',
            travao_sustentabilidade: 'Falta_consciencia',
            emissoes_angola: 'Nunca_explicaram',
            contribui_emissoes: 'Uso_ineficiente',
            futuro_empresas: 'Sobreviver_limitacoes',
            timestamp: '2026-01-20T11:15:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Pedro Costa',
            pratica_sustentabilidade: 'Melhora_imagem',
            travao_sustentabilidade: 'Falta_financiamento',
            emissoes_angola: 'Problema_outros',
            contribui_emissoes: 'Agua_eletricidade',
            futuro_empresas: 'Perder_competitividade',
            timestamp: '2026-01-20T14:20:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Ana Ferreira',
            pratica_sustentabilidade: 'Exigencia_internacional',
            travao_sustentabilidade: 'Falta_confianca',
            emissoes_angola: 'Nao_pensamos',
            contribui_emissoes: 'Transito_transportes',
            futuro_empresas: 'Perder_competitividade',
            timestamp: '2026-01-21T09:45:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Carlos Mendes',
            pratica_sustentabilidade: 'Nao_prioridade',
            travao_sustentabilidade: 'Falta_lideranca',
            emissoes_angola: 'Outras_prioridades',
            contribui_emissoes: 'Nunca_pensei',
            futuro_empresas: 'Manter_iguais',
            timestamp: '2026-01-21T16:30:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Sofia Rodrigues',
            pratica_sustentabilidade: 'Conviccao_estrategica',
            travao_sustentabilidade: 'Falta_consciencia',
            emissoes_angola: 'Nunca_explicaram',
            contribui_emissoes: 'Uso_ineficiente',
            futuro_empresas: 'Sobreviver_limitacoes',
            timestamp: '2026-01-22T08:00:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Miguel Alves',
            pratica_sustentabilidade: 'Melhora_imagem',
            travao_sustentabilidade: 'Falta_financiamento',
            emissoes_angola: 'Problema_outros',
            contribui_emissoes: 'Agua_eletricidade',
            futuro_empresas: 'Perder_competitividade',
            timestamp: '2026-01-22T13:15:00.000Z',
            isDemoData: true
        },
        {
            nome: 'Teresa Martins',
            pratica_sustentabilidade: 'Exigencia_internacional',
            travao_sustentabilidade: 'Falta_lideranca',
            emissoes_angola: 'Nao_pensamos',
            contribui_emissoes: 'Transito_transportes',
            futuro_empresas: 'Perder_competitividade',
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
        pratica_sustentabilidade: {},
        travao_sustentabilidade: {},
        emissoes_angola: {},
        contribui_emissoes: {},
        futuro_empresas: {}
    };

    respostas.forEach(resposta => {
        // Contar prática sustentabilidade
        const pratica = resposta.pratica_sustentabilidade || 'Não especificado';
        stats.pratica_sustentabilidade[pratica] = (stats.pratica_sustentabilidade[pratica] || 0) + 1;

        // Contar travão sustentabilidade
        const travao = resposta.travao_sustentabilidade || 'Não especificado';
        stats.travao_sustentabilidade[travao] = (stats.travao_sustentabilidade[travao] || 0) + 1;

        // Contar emissões Angola
        const emissoes = resposta.emissoes_angola || 'Não especificado';
        stats.emissoes_angola[emissoes] = (stats.emissoes_angola[emissoes] || 0) + 1;

        // Contar contribui emissões
        const contribui = resposta.contribui_emissoes || 'Não especificado';
        stats.contribui_emissoes[contribui] = (stats.contribui_emissoes[contribui] || 0) + 1;

        // Contar futuro empresas
        const futuro = resposta.futuro_empresas || 'Não especificado';
        stats.futuro_empresas[futuro] = (stats.futuro_empresas[futuro] || 0) + 1;
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

// Criar gráfico prática sustentabilidade (DONUT)
function criarGraficoPratica(stats) {
    const canvas = document.getElementById('praticaSustChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (praticaSustChart) {
        praticaSustChart.destroy();
    }

    const labels = Object.keys(stats.pratica_sustentabilidade).map(key => {
        const map = {
            'Conviccao_estrategica': 'Convicção estratégica',
            'Exigencia_internacional': 'Exigência internacional',
            'Melhora_imagem': 'Melhora imagem',
            'Nao_prioridade': 'Não é prioridade'
        };
        return map[key] || key;
    });
    const data = Object.values(stats.pratica_sustentabilidade);
    const backgroundColors = [cores.verde, cores.azul, cores.roxo, cores.laranja];

    praticaSustChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 4,
                borderColor: '#fff',
                hoverOffset: 15,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 8,
                        font: { size: 10, weight: '600' },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000
            }
        }
    });
}

// Criar gráfico travão sustentabilidade (BARRAS HORIZONTAIS)
function criarGraficoTravao(stats) {
    const canvas = document.getElementById('travaoChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (travaoChart) {
        travaoChart.destroy();
    }

    const labels = Object.keys(stats.travao_sustentabilidade).map(key => {
        const map = {
            'Falta_lideranca': 'Falta liderança',
            'Falta_consciencia': 'Falta consciência',
            'Falta_financiamento': 'Falta financiamento',
            'Falta_confianca': 'Falta confiança'
        };
        return map[key] || key;
    });
    const data = Object.values(stats.travao_sustentabilidade);
    const backgroundColors = [cores.rosa, cores.ciano, cores.amarelo, cores.roxo];

    travaoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Respostas',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c + 'CC'),
                borderWidth: 2,
                borderRadius: 10,
                barThickness: 40
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 14,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Respostas: ${context.parsed.x}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 11, weight: '500' },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.06)',
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        font: { size: 11, weight: '600' },
                        color: '#333'
                    },
                    grid: { display: false }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Criar gráfico emissões angola (PIZZA)
function criarGraficoEmissoes(stats) {
    const canvas = document.getElementById('emissoesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (emissoesChart) {
        emissoesChart.destroy();
    }

    const labels = Object.keys(stats.emissoes_angola).map(key => {
        const map = {
            'Outras_prioridades': 'Outras prioridades',
            'Problema_outros': 'Problema dos outros',
            'Nunca_explicaram': 'Nunca explicaram',
            'Nao_pensamos': 'Não pensamos nisso'
        };
        return map[key] || key;
    });
    const data = Object.values(stats.emissoes_angola);
    const backgroundColors = [cores.verdeEscuro, cores.laranja, cores.azul, cores.rosa];

    emissoesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 4,
                borderColor: '#fff',
                hoverOffset: 12,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 8,
                        font: { size: 10, weight: '600' },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000
            }
        }
    });
}

// Criar gráfico contribui emissões (BARRAS HORIZONTAIS)
function criarGraficoContribui(stats) {
    const canvas = document.getElementById('contribuiChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (contribuiChart) {
        contribuiChart.destroy();
    }

    const labels = Object.keys(stats.contribui_emissoes).map(key => {
        const map = {
            'Transito_transportes': 'Trânsito/transportes',
            'Uso_ineficiente': 'Uso ineficiente',
            'Agua_eletricidade': 'Água/eletricidade',
            'Nunca_pensei': 'Nunca pensei'
        };
        return map[key] || key;
    });
    const data = Object.values(stats.contribui_emissoes);
    const backgroundColors = [cores.ciano, cores.roxo, cores.verde, cores.amarelo];

    contribuiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Respostas',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c + 'CC'),
                borderWidth: 2,
                borderRadius: 10,
                barThickness: 40
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 14,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Respostas: ${context.parsed.x}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 11, weight: '500' },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.06)',
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        font: { size: 11, weight: '600' },
                        color: '#333'
                    },
                    grid: { display: false }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Criar gráfico futuro empresas (DONUT)
function criarGraficoFuturo(stats) {
    const canvas = document.getElementById('futuroChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (futuroChart) {
        futuroChart.destroy();
    }

    const labels = Object.keys(stats.futuro_empresas).map(key => {
        const map = {
            'Perder_competitividade': 'Perder competitividade',
            'Sobreviver_limitacoes': 'Sobreviver com limitações',
            'Manter_iguais': 'Manter-se iguais',
            'Sem_impactos': 'Sem impactos'
        };
        return map[key] || key;
    });
    const data = Object.values(stats.futuro_empresas);
    const backgroundColors = [cores.rosa, cores.laranja, cores.azul, cores.verde];

    futuroChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 4,
                borderColor: '#fff',
                hoverOffset: 15,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 8,
                        font: { size: 10, weight: '600' },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000
            }
        }
    });
}

// Criar gráfico de crescimento/tendência (LINHA)
function criarGraficoCrescimento() {
    const canvas = document.getElementById('crescimentoChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (crescimentoChart) {
        crescimentoChart.destroy();
    }

    // Definir horários fixos do evento: 08:00 até 16:00
    const horasEvento = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const respostasPorHora = {};

    // Inicializar todas as horas com 0
    horasEvento.forEach(hora => {
        respostasPorHora[hora] = 0;
    });

    // Contar respostas reais por horário
    respostas.forEach(resposta => {
        if (resposta.timestamp) {
            const data = new Date(resposta.timestamp);
            const hora = data.getHours();
            const label = `${hora.toString().padStart(2, '0')}:00`;

            // Só contar se estiver dentro do horário do evento
            if (respostasPorHora.hasOwnProperty(label)) {
                respostasPorHora[label]++;
            }
        }
    });

    // Calcular valores acumulados (crescimento de inscritos)
    let acumulado = 0;
    const dadosAcumulados = horasEvento.map(hora => {
        acumulado += respostasPorHora[hora];
        return acumulado;
    });

    const labels = horasEvento;
    const data = dadosAcumulados;

    crescimentoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total de Inscritos',
                data: data,
                backgroundColor: 'rgba(38, 166, 154, 0.1)',
                borderColor: cores.verde,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: cores.verde,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: cores.verdeEscuro,
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 13, weight: '600' },
                        color: '#333',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Total de Inscritos: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 11, weight: '500' },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.06)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Total de Inscritos',
                        font: { size: 12, weight: '600' },
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        font: { size: 11, weight: '500' },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.04)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Horário',
                        font: { size: 12, weight: '600' },
                        color: '#333'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Atualizar tabela de participantes
function atualizarTabela() {
    const tbody = document.getElementById('participantesBody');

    if (respostas.length === 0) {
        const colspan = tbody.closest('table').querySelectorAll('thead th').length;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">Aguardando respostas...</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    // Mostra todas as respostas
    respostas.slice().reverse().forEach((resposta, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${respostas.length - index}</td>
            <td>${resposta.nome}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Atualizar todos os dados
function atualizarDashboard() {
    respostas = carregarDados();
    const stats = processarDados();

    atualizarEstatisticas(stats);
    criarGraficoCrescimento();
    criarGraficoPratica(stats);
    criarGraficoTravao(stats);
    criarGraficoEmissoes(stats);
    criarGraficoContribui(stats);
    criarGraficoFuturo(stats);
    atualizarTabela();
}

// Exportar para CSV
function exportarCSV() {
    const headers = ['Nome', 'Prática Sustentabilidade', 'Travão Sustentabilidade', 'Emissões Angola', 'Contribui Emissões', 'Futuro Empresas', 'Data'];
    const linhas = respostas.map(r => [
        r.nome,
        r.pratica_sustentabilidade || '',
        r.travao_sustentabilidade || '',
        r.emissoes_angola || '',
        r.contribui_emissoes || '',
        r.futuro_empresas || '',
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

    // Botão de toggle para ocultar/mostrar participantes (dados confidenciais)
    const toggleParticipantesBtn = document.getElementById('toggleParticipantesBtn');
    const participantesWrapper = document.getElementById('participantesWrapper');

    if (toggleParticipantesBtn && participantesWrapper) {
        // Carregar preferência salva
        const isHidden = localStorage.getItem('participantesHidden') === 'true';
        if (isHidden) {
            participantesWrapper.style.display = 'none';
            toggleParticipantesBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar Participantes';
        }

        toggleParticipantesBtn.addEventListener('click', () => {
            const currentlyHidden = participantesWrapper.style.display === 'none';

            if (currentlyHidden) {
                participantesWrapper.style.display = 'block';
                toggleParticipantesBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Participantes';
                localStorage.setItem('participantesHidden', 'false');
            } else {
                participantesWrapper.style.display = 'none';
                toggleParticipantesBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar Participantes';
                localStorage.setItem('participantesHidden', 'true');
            }
        });
    }

    // Atualização automática a cada 3 segundos para refletir mudanças em tempo real
    setInterval(atualizarDashboard, 3000);
});
