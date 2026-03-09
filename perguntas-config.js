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
        pergunta: 'Na sua opinião que factores do passado influenciaram a forma como hoje pensamos sobre sustentabilidade e desenvolvimento económico?',
        opcoes: [
            { valor: 'Reconstrucao_crescimento', texto: 'Reconstrução e crescimento económico' },
            { valor: 'Crises_petroleo', texto: 'Crises e volatilidade do petróleo' },
            { valor: 'Consciencia_ambiental', texto: 'Consciência ambiental global' },
            { valor: 'Pressao_ESG', texto: 'Pressão por padrões ESG' }
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
            { valor: 'Falta_financiamento_verde', texto: 'Financiamento verde' },
            { valor: 'Falta_conhecimento', texto: 'Conhecimento técnico' },
            { valor: 'Falta_incentivos', texto: 'Incentivos e políticas' },
            { valor: 'Sustentabilidade_custo', texto: 'Sustentabilidade = custo' }
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
            { valor: 'Incentivos_fiscais', texto: 'Incentivos fiscais e financeiros' },
            { valor: 'Inovacao_tecnologia', texto: 'Inovação e tecnologia' },
            { valor: 'Capital_humano', texto: 'Capital humano e formação' },
            { valor: 'Parcerias_internacionais', texto: 'Parcerias internacionais' }
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
