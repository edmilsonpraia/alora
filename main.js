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

    // Evento de submissão do formulário (para páginas individuais de pergunta)
    if (surveyForm) {
        surveyForm.addEventListener('submit', function (event) {
            event.preventDefault();
            clearErrors();

            if (!validateForm()) {
                return;
            }

            const formData = new FormData(surveyForm);
            const data = Object.fromEntries(formData.entries());

            console.log('Dados do formulário:', data);
            saveSubmission(data);

            if (successMessage) {
                successMessage.style.display = 'block';
                surveyForm.parentElement.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }

            surveyForm.reset();

            setTimeout(() => {
                if (successMessage) successMessage.style.display = 'none';
            }, 5000);

            if (typeof atualizarDashboard === 'function') {
                setTimeout(() => atualizarDashboard(), 500);
            }
        });
    }

    if (downloadCsvBtn) downloadCsvBtn.addEventListener('click', generateCSV);
    if (downloadReportBtn) downloadReportBtn.addEventListener('click', generateReport);

    function validateForm() {
        let isValid = true;
        const requiredFields = ['nome'];

        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input && !input.value.trim()) {
                showError(input, 'Este campo é obrigatório.');
                isValid = false;
            }
        });

        // Validar radio groups das novas perguntas
        const radioGroups = ['factores_passado', 'obstaculo_sustentabilidade', 'prioridade_estrategica'];
        radioGroups.forEach(groupName => {
            const radios = document.getElementsByName(groupName);
            if (radios.length > 0) {
                const checked = Array.from(radios).some(radio => radio.checked);
                if (!checked) {
                    const radioGroup = radios[0].closest('.form-group');
                    const label = radioGroup.querySelector('label');
                    if (label) {
                        label.style.color = '#e74c3c';
                        setTimeout(() => { label.style.color = ''; }, 3000);
                    }
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');

        input.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.style.display = 'none');

        const invalidInputs = document.querySelectorAll('.invalid');
        invalidInputs.forEach(input => input.classList.remove('invalid'));
    }

    // --- Funções de Admin ---

    function getSubmissions() {
        return JSON.parse(localStorage.getItem('surveySubmissions')) || [];
    }

    function saveSubmission(data) {
        const submissions = getSubmissions();
        data.timestamp = new Date().toISOString();
        submissions.push(data);
        localStorage.setItem('surveySubmissions', JSON.stringify(submissions));
        localStorage.setItem('surveyResponses', JSON.stringify(submissions));
    }

    function renderAdminPanel() {
        const submissions = getSubmissions();
        if (submissionCountEl) submissionCountEl.textContent = submissions.length;
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

        const stats = {};
        submissions.forEach(sub => {
            for (const key in sub) {
                if (!sub[key] || key === 'timestamp' || key === 'nome') continue;
                if (!stats[key]) stats[key] = {};
                const value = sub[key];
                stats[key][value] = (stats[key][value] || 0) + 1;
            }
        });

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

        reportHTML += '<h2>Resumo das Respostas</h2>';
        for (const key in stats) {
            reportHTML += `<div class="stats-section"><h4>${key.replace(/_/g, ' ')}</h4><ul>`;
            for (const option in stats[key]) {
                const percentage = ((stats[key][option] / submissions.length) * 100).toFixed(1);
                reportHTML += `<li><strong>${option}:</strong> ${stats[key][option]} respostas (${percentage}%)</li>`;
            }
            reportHTML += '</ul></div>';
        }

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

        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    }
});
