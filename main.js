document.addEventListener('DOMContentLoaded', function () {
    const surveyForm = document.getElementById('surveyForm');
    const successMessage = document.getElementById('successMessage');
    const submissionCountEl = document.getElementById('submissionCount');
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    const adminPanel = document.getElementById('adminPanel');

    // Toggle Admin Panel
    if (toggleAdminBtn) {
        toggleAdminBtn.addEventListener('click', () => {
            if (adminPanel.style.display === 'none') {
                adminPanel.style.display = 'block';
                renderAdminPanel();
            } else {
                adminPanel.style.display = 'none';
            }
        });
    }

    // Evento de submissão do formulário
    surveyForm.addEventListener('submit', function (event) {
        // Previne o comportamento padrão de submissão do formulário
        event.preventDefault();

        // Limpa erros anteriores
        clearErrors();

        // Validação profissional
        if (!validateForm()) {
            return; // Interrompe se a validação falhar
        }

        // Coleta os dados do formulário
        const formData = new FormData(surveyForm);
        const data = Object.fromEntries(formData.entries());

        // Exibe os dados no console (simulando o envio para um servidor)
        console.log('Dados do formulário:', data);

        // Salva os dados no localStorage
        saveSubmission(data);

        // Exibe a mensagem de sucesso
        successMessage.style.display = 'block'; // Mostra a mensagem de sucesso
        
        // Rola a página para o topo para ver a mensagem
        surveyForm.parentElement.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Limpa o formulário após o envio
        surveyForm.reset();

        // Esconde a mensagem de sucesso após alguns segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        // Atualiza o dashboard após envio bem-sucedido
        if (typeof atualizarDashboard === 'function') {
            setTimeout(() => atualizarDashboard(), 500);
        }
    });

    downloadCsvBtn.addEventListener('click', generateCSV);
    downloadReportBtn.addEventListener('click', generateReport);

    function validateForm() {
        let isValid = true;
        const requiredFields = ['nome', 'email']; // Campos obrigatórios atualizados

        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (!input.value.trim()) {
                showError(input, 'Este campo é obrigatório.');
                isValid = false;
            }
        });

        // Validação específica para o email
        const emailInput = document.getElementById('email');
        if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Por favor, insira um email válido.');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.style.display = 'none');

        const invalidInputs = document.querySelectorAll('.invalid');
        invalidInputs.forEach(input => input.classList.remove('invalid'));
    }

    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // --- Funções de Admin ---

    function getSubmissions() {
        return JSON.parse(localStorage.getItem('surveySubmissions')) || [];
    }

    function saveSubmission(data) {
        const submissions = getSubmissions();

        // Adiciona timestamp
        data.timestamp = new Date().toISOString();

        submissions.push(data);
        localStorage.setItem('surveySubmissions', JSON.stringify(submissions));

        // Também salva no formato esperado pelo dashboard
        localStorage.setItem('surveyResponses', JSON.stringify(submissions));
    }

    function renderAdminPanel() {
        const submissions = getSubmissions();
        submissionCountEl.textContent = submissions.length;
    }

    function generateCSV() {
        const submissions = getSubmissions();
        if (submissions.length === 0) {
            alert('Nenhuma submissão para exportar.');
            return;
        }

        const headers = Object.keys(submissions[0]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

        submissions.forEach(row => {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvContent += values.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "relatorio_inquerito.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateReport() {
        const submissions = getSubmissions();
        if (submissions.length === 0) {
            alert('Nenhuma submissão para gerar relatório.');
            return;
        }

        // --- Análise de Dados ---
        const stats = {};
        const textQuestions = ['sugestao_orador', 'sugestao_desafio', 'sugestao_adicional'];
        submissions.forEach(sub => {
            for (const key in sub) {
                if (textQuestions.includes(key) || !sub[key]) continue;

                if (!stats[key]) stats[key] = {};
                const value = sub[key];
                stats[key][value] = (stats[key][value] || 0) + 1;
            }
        });

        // --- Geração do HTML do Relatório ---
        let reportHTML = `
            <!DOCTYPE html><html lang="pt"><head><title>Relatório Profissional</title>
            <style>
                body { font-family: sans-serif; margin: 2em; }
                h1, h2 { color: #00897B; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .stats-section { margin-bottom: 30px; page-break-inside: avoid; }
                @media print { button { display: none; } }
            </style>
            </head><body>
            <button onclick="window.print()">Imprimir ou Salvar como PDF</button>
            <h1>Relatório do Inquérito - 2º Fórum Nacional de Negócios Sustentáveis</h1>
            <p>Total de Respostas: <strong>${submissions.length}</strong></p>
        `;

        // Seção de Estatísticas
        reportHTML += '<h2>Resumo das Respostas</h2>';
        for (const key in stats) {
            reportHTML += `<div class="stats-section"><h4>${key.replace(/_/g, ' ')}</h4><ul>`;
            for (const option in stats[key]) {
                const percentage = ((stats[key][option] / submissions.length) * 100).toFixed(1);
                reportHTML += `<li><strong>${option}:</strong> ${stats[key][option]} respostas (${percentage}%)</li>`;
            }
            reportHTML += '</ul></div>';
        }

        // Seção de Tabela Completa
        reportHTML += '<h2>Dados Completos</h2><table><thead><tr>';
        const headers = Object.keys(submissions[0]);
        headers.forEach(h => reportHTML += `<th>${h}</th>`);
        reportHTML += '</tr></thead><tbody>';
        submissions.forEach(sub => {
            reportHTML += '<tr>';
            headers.forEach(h => reportHTML += `<td>${sub[h] || ''}</td>`);
            reportHTML += '</tr>';
        });
        reportHTML += '</tbody></table></body></html>';

        // Abrir em nova aba
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    }
});
