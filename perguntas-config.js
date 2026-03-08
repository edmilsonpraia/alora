// Configuração central das perguntas do inquérito
// Para alterar perguntas, edite apenas este ficheiro.
// As páginas individuais, QR codes e dashboard adaptam-se automaticamente.

const PERGUNTAS_CONFIG = [
    {
        id: 1,
        campo: 'factores_passado',
        titulo: 'Pergunta 1',
        icone: 'fas fa-history',
        iconeCor: 'icon-history',
        pergunta: 'Na sua opinião que factores do passado influenciaram a forma como hoje pensamos sustentabilidade e desenvolvimento económico?',
        opcoes: [
            { valor: 'Reconstrucao_crescimento', texto: 'A reconstrução nacional e crescimento económico acelerado' },
            { valor: 'Crises_petroleo', texto: 'As crises económicas e volatilidade do petróleo' },
            { valor: 'Consciencia_ambiental', texto: 'A crescente consciência ambiental global' },
            { valor: 'Pressao_ESG', texto: 'A pressão internacional por padrões ESG e transição energética' }
        ],
        dashboardTitulo: 'Factores do Passado',
        dashboardDescricao: 'Factores que influenciaram o pensamento sobre sustentabilidade',
        tipoGrafico: 'doughnut'
    },
    {
        id: 2,
        campo: 'obstaculo_sustentabilidade',
        titulo: 'Pergunta 2',
        icone: 'fas fa-exclamation-triangle',
        iconeCor: 'icon-obstacle',
        pergunta: 'Na sua opinião, qual é hoje o maior obstáculo para a implementação de práticas sustentáveis nos negócios em Angola?',
        opcoes: [
            { valor: 'Falta_financiamento_verde', texto: 'Falta de financiamento verde' },
            { valor: 'Falta_conhecimento', texto: 'Falta de conhecimento técnico e capacitação' },
            { valor: 'Falta_incentivos', texto: 'Falta de incentivos e políticas claras' },
            { valor: 'Sustentabilidade_custo', texto: 'Percepção de que sustentabilidade é custo e não investimento' }
        ],
        dashboardTitulo: 'Maior Obstáculo',
        dashboardDescricao: 'Principal obstáculo para práticas sustentáveis em Angola',
        tipoGrafico: 'bar'
    },
    {
        id: 3,
        campo: 'prioridade_estrategica',
        titulo: 'Pergunta 3',
        icone: 'fas fa-bullseye',
        iconeCor: 'icon-strategy',
        pergunta: 'Para que Angola se posicione como referência em negócios sustentáveis em África, na sua opinião qual deveria ser a prioridade estratégica do país?',
        opcoes: [
            { valor: 'Incentivos_fiscais', texto: 'Criar incentivos fiscais e financeiros para negócios verdes' },
            { valor: 'Inovacao_tecnologia', texto: 'Investir fortemente em inovação e tecnologia' },
            { valor: 'Capital_humano', texto: 'Desenvolver capital humano e formação especializada' },
            { valor: 'Parcerias_internacionais', texto: 'Fortalecer parcerias internacionais e financiamento climático' }
        ],
        dashboardTitulo: 'Prioridade Estratégica',
        dashboardDescricao: 'Prioridade para Angola ser referência em negócios sustentáveis',
        tipoGrafico: 'pie'
    }
];

// Exportar para uso em diferentes contextos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PERGUNTAS_CONFIG;
}
