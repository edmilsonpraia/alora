// Dashboard JavaScript - Gráficos e Visualizações (Novas 3 Perguntas)
// Lê automaticamente da configuração em perguntas-config.js

Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = '#666';

// Variáveis globais
let factoresChart, obstaculoChart, prioridadeChart, crescimentoChart;
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

// Mapeamento de valores para labels legíveis (gerado a partir do config)
function gerarLabelMap() {
    const map = {};
    if (typeof PERGUNTAS_CONFIG !== 'undefined') {
        PERGUNTAS_CONFIG.forEach(pergunta => {
            pergunta.opcoes.forEach(opcao => {
                map[opcao.valor] = opcao.texto;
            });
        });
    }
    return map;
}

// Carregar dados - usa Firebase via DB.getAll() com fallback para localStorage
function carregarDados() {
    respostas = DB.getAll();
    return respostas;
}

// Processar dados para estatísticas
function processarDados() {
    const stats = {
        total: respostas.length,
        factores_passado: {},
        obstaculo_sustentabilidade: {},
        prioridade_estrategica: {}
    };

    respostas.forEach(resposta => {
        if (resposta.factores_passado) {
            const val = resposta.factores_passado;
            stats.factores_passado[val] = (stats.factores_passado[val] || 0) + 1;
        }
        if (resposta.obstaculo_sustentabilidade) {
            const val = resposta.obstaculo_sustentabilidade;
            stats.obstaculo_sustentabilidade[val] = (stats.obstaculo_sustentabilidade[val] || 0) + 1;
        }
        if (resposta.prioridade_estrategica) {
            const val = resposta.prioridade_estrategica;
            stats.prioridade_estrategica[val] = (stats.prioridade_estrategica[val] || 0) + 1;
        }
    });

    return stats;
}

// Atualizar estatísticas resumidas
function atualizarEstatisticas(stats) {
    document.getElementById('totalRespostas').textContent = stats.total;

    const taxaElement = document.getElementById('taxaResposta');
    if (taxaElement) {
        taxaElement.textContent = '100%';
    }

    const agora = new Date();
    const horaAtual = agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('ultimaAtualizacao').textContent = horaAtual;
}

// Criar gráfico Pergunta 1 - Factores do Passado (DONUT)
function criarGraficoFactores(stats) {
    const canvas = document.getElementById('factoresChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (factoresChart) factoresChart.destroy();

    const labelMap = gerarLabelMap();
    const labels = Object.keys(stats.factores_passado).map(key => labelMap[key] || key);
    const data = Object.values(stats.factores_passado);
    const backgroundColors = [cores.azul, cores.laranja, cores.verde, cores.roxo];

    factoresChart = new Chart(ctx, {
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
            cutout: '55%',
            layout: { padding: { bottom: 10 } },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 12, font: { size: 11, weight: '600' }, usePointStyle: true, pointStyle: 'circle', boxWidth: 10 }
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
            animation: { animateRotate: true, animateScale: true, duration: 1000 }
        }
    });
}

// Criar gráfico Pergunta 2 - Obstáculo (BARRAS HORIZONTAIS)
function criarGraficoObstaculo(stats) {
    const canvas = document.getElementById('obstaculoChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (obstaculoChart) obstaculoChart.destroy();

    const labelMap = gerarLabelMap();
    const labels = Object.keys(stats.obstaculo_sustentabilidade).map(key => labelMap[key] || key);
    const data = Object.values(stats.obstaculo_sustentabilidade);
    const backgroundColors = [cores.rosa, cores.ciano, cores.amarelo, cores.roxo];

    obstaculoChart = new Chart(ctx, {
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
                barThickness: 35
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { left: 10, right: 20 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 14,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) { return `Respostas: ${context.parsed.x}`; }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { size: 11, weight: '500' }, color: '#666' },
                    grid: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false }
                },
                y: {
                    ticks: { font: { size: 12, weight: '700' }, color: '#333', padding: 8 },
                    grid: { display: false },
                    afterFit: function(scaleInstance) { scaleInstance.width = 180; }
                }
            },
            animation: { duration: 1000, easing: 'easeInOutQuart' }
        }
    });
}

// Criar gráfico Pergunta 3 - Prioridade Estratégica (PIZZA)
function criarGraficoPrioridade(stats) {
    const canvas = document.getElementById('prioridadeChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (prioridadeChart) prioridadeChart.destroy();

    const labelMap = gerarLabelMap();
    const labels = Object.keys(stats.prioridade_estrategica).map(key => labelMap[key] || key);
    const data = Object.values(stats.prioridade_estrategica);
    const backgroundColors = [cores.verdeEscuro, cores.laranja, cores.rosa, cores.azul];

    prioridadeChart = new Chart(ctx, {
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
            layout: { padding: { bottom: 10 } },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 12, font: { size: 11, weight: '600' }, usePointStyle: true, pointStyle: 'circle', boxWidth: 10 }
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
            animation: { animateRotate: true, animateScale: true, duration: 1000 }
        }
    });
}

// Criar gráfico de crescimento/tendência (LINHA)
function criarGraficoCrescimento() {
    const canvas = document.getElementById('crescimentoChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (crescimentoChart) crescimentoChart.destroy();

    const horasEvento = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const respostasPorHora = {};

    horasEvento.forEach(hora => { respostasPorHora[hora] = 0; });

    respostas.forEach(resposta => {
        if (resposta.timestamp) {
            const data = new Date(resposta.timestamp);
            const hora = data.getHours();
            const label = `${hora.toString().padStart(2, '0')}:00`;
            if (respostasPorHora.hasOwnProperty(label)) {
                respostasPorHora[label]++;
            }
        }
    });

    let acumulado = 0;
    const dadosAcumulados = horasEvento.map(hora => {
        acumulado += respostasPorHora[hora];
        return acumulado;
    });

    crescimentoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: horasEvento,
            datasets: [{
                label: 'Total de Inscritos',
                data: dadosAcumulados,
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
                    labels: { font: { size: 13, weight: '600' }, color: '#333', usePointStyle: true, pointStyle: 'circle', padding: 15 }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) { return `Total de Inscritos: ${context.parsed.y}`; }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { size: 11, weight: '500' }, color: '#666' },
                    grid: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false },
                    title: { display: true, text: 'Total de Inscritos', font: { size: 12, weight: '600' }, color: '#333' }
                },
                x: {
                    ticks: { font: { size: 11, weight: '500' }, color: '#666' },
                    grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
                    title: { display: true, text: 'Horário', font: { size: 12, weight: '600' }, color: '#333' }
                }
            },
            animation: { duration: 1500, easing: 'easeInOutQuart' }
        }
    });
}

// Atualizar tabela de participantes
function atualizarTabela() {
    const tbody = document.getElementById('participantesBody');

    if (respostas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Aguardando respostas...</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    respostas.slice().reverse().forEach((resposta, index) => {
        const tr = document.createElement('tr');
        const numPergunta = resposta.pergunta || (resposta.isDemoData ? 'Demo' : '--');
        const realIndex = respostas.length - 1 - index;
        tr.innerHTML = `
            <td>${respostas.length - index}</td>
            <td>${resposta.nome}</td>
            <td>${numPergunta}</td>
            <td><button class="btn-delete" onclick="eliminarParticipante(${realIndex})"><i class="fas fa-trash"></i> Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Eliminar um participante individual
function eliminarParticipante(index) {
    const nome = respostas[index] ? respostas[index].nome : '';
    if (!confirm(`Tem certeza que deseja eliminar "${nome}"?`)) return;

    if (_dbReady && _dbRef) {
        // Eliminar do Firebase
        _dbRef.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const keys = Object.keys(data);
                if (keys[index]) {
                    _dbRef.child(keys[index]).remove().then(() => {
                        atualizarDashboard();
                    });
                }
            }
        });
    } else {
        // Fallback localStorage
        const local = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
        local.splice(index, 1);
        localStorage.setItem('surveyResponses', JSON.stringify(local));
        atualizarDashboard();
    }
}

// Eliminar todos os participantes
function eliminarTodos() {
    if (respostas.length === 0) {
        alert('Não há participantes para eliminar.');
        return;
    }
    if (!confirm(`Tem certeza que deseja eliminar TODOS os ${respostas.length} participantes? Esta ação não pode ser desfeita.`)) return;

    DB.clear();
    atualizarDashboard();
}

// Atualizar todos os dados
function atualizarDashboard() {
    respostas = carregarDados();
    const stats = processarDados();

    atualizarEstatisticas(stats);
    criarGraficoCrescimento();
    criarGraficoFactores(stats);
    criarGraficoObstaculo(stats);
    criarGraficoPrioridade(stats);
    atualizarTabela();
}

// Exportar para CSV
function exportarCSV() {
    const headers = ['Nome', 'Factores Passado', 'Obstáculo Sustentabilidade', 'Prioridade Estratégica', 'Pergunta', 'Data'];
    const linhas = respostas.map(r => [
        r.nome,
        r.factores_passado || '',
        r.obstaculo_sustentabilidade || '',
        r.prioridade_estrategica || '',
        r.pergunta || '',
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
    setTimeout(() => { atualizarDashboard(); }, 100);

    // Escutar atualizações em tempo real do Firebase
    DB.onUpdate(function() { atualizarDashboard(); });

    // Botão de atualizar
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

    // Exportação
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportarCSV);
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            alert('Use a função de impressão do navegador (Ctrl+P) e salve como PDF.');
            window.print();
        });
    }
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportarCSV);

    // Toggle de visibilidade das secções do inquérito
    const toggleButtons = document.querySelectorAll('.btn-toggle-section');
    toggleButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');

        // Carregar preferência guardada
        const savedState = localStorage.getItem('dashboard_visible_' + targetId);
        if (savedState === 'false') {
            const target = document.getElementById(targetId);
            if (target) target.classList.add('section-hidden');
            btn.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            const target = document.getElementById(targetId);
            if (!target) return;

            const isHidden = target.classList.toggle('section-hidden');
            btn.classList.toggle('active', !isHidden);

            // Guardar preferência
            localStorage.setItem('dashboard_visible_' + targetId, !isHidden);
        });
    });

    // Atualização automática a cada 3 segundos
    setInterval(atualizarDashboard, 3000);
});
