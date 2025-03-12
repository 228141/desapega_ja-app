//1 Função para mostrar uma tela específica e ocultar as demais
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        } else {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        }
    });
}

//2 Inicialização das funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializePage();

    // Event listener para o formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Event listener para o formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listener para o formulário de redefinição de senha
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }

    // Event listener para o formulário de medição
    const measurementForm = document.getElementById('form-medicao');
    if (measurementForm) {
        measurementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nivelGlicose = document.getElementById('nivel-glicose').value;
            const dataHora = document.getElementById('data-hora').value;

            salvarMedicao(nivelGlicose, dataHora);
            alert('Medição salva com sucesso!');
            showScreen('ultima-medicao');
        });
    }

    // Inicializa a última medição e histórico
    if (window.location.pathname.includes('page2.html')) {
        exibirUltimaMedicao();

        // Adiciona event listener para exibir histórico
        const historicoBtn = document.getElementById('historico-btn');
        if (historicoBtn) {
            historicoBtn.addEventListener('click', function() {
                showScreen('historico-medicoes');
            });
        }
    }
});

//3 Função para inicializar a página com base na URL ou exibir a tela padrão
function initializePage() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showScreen(hash);
    } else {
        showScreen('dashboard-screen'); // Tela padrão
    }
}

//4 Funções relacionadas para salvar medições
function salvarMedicao(nivelGlicose, dataHora) {
    const medicao = { nivelGlicose, dataHora };
    let medicoes = JSON.parse(localStorage.getItem('medicoes')) || [];
    medicoes.push(medicao);
    localStorage.setItem('medicoes', JSON.stringify(medicoes));
    exibirUltimaMedicao();
}

//5 Função para mostrar a tela do histórico
function mostrarTelaHistorico() {
    showScreen('historico-medicoes');
    exibirHistoricoMedicoes(); // Atualiza a lista de medições
}

function exibirUltimaMedicao() {
    const medicaoAtualDiv = document.getElementById('medicao-atual');
    if (!medicaoAtualDiv) return;

    let medicoes = JSON.parse(localStorage.getItem('medicoes')) || [];
    if (medicoes.length > 0) {
        const ultimaMedicao = medicoes[medicoes.length - 1];
        medicaoAtualDiv.innerHTML = `
            <p>Nível de Glicose: ${ultimaMedicao.nivelGlicose} mg/dL</p>
            <p>Data e Hora: ${new Date(ultimaMedicao.dataHora).toLocaleString()}</p>
        `;
    } else {
        medicaoAtualDiv.innerHTML = '<p>Nenhuma medição registrada.</p>';
    }
}


// Função para exibir o histórico de medições em uma tabela
function exibirHistoricoMedicoes() {
    const listaHistorico = document.getElementById('lista-historico-medicoes');
    if (!listaHistorico) return;

    const userEmail = localStorage.getItem('loggedInUser'); // Obtém o e-mail do usuário logado
    listaHistorico.innerHTML = ''; // Limpa o conteúdo da tabela
    const historico = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];

    if (historico.length === 0) {
        listaHistorico.innerHTML = '<tr><td colspan="3">Nenhuma medição registrada.</td></tr>';
    } else {
        historico.forEach((medicao) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Medição</td>
                <td>${medicao.nivelGlicose} mg/dL</td>
                <td>${new Date(medicao.dataHora).toLocaleString()}</td>
            `;
            listaHistorico.appendChild(row);
        });
    }
}

//6 Função para exibir o gráfico
function exibirGrafico() {
    const ctx = document.getElementById('graficoGlicose').getContext('2d');

    // Recupera o histórico do localStorage
    const userEmail = localStorage.getItem('loggedInUser');
    const historico = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];

    if (historico.length === 0) {
        alert('Nenhuma medição registrada para exibir no gráfico.');
        return;
    }

    const niveisGlicose = historico.map(medicao => medicao.nivelGlicose);
    const datas = historico.map(medicao => new Date(medicao.dataHora).toLocaleString());

    // Cria o gráfico usando Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datas, // Datas das medições
            datasets: [{
                label: 'Nível de Glicose (mg/dL)',
                data: niveisGlicose,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Data e Hora'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Nível de Glicose (mg/dL)'
                    }
                }
            }
        }
    });
}
//6.1 Função para exibir o gráfico
const graficoBtn = document.querySelector('button[onclick="showScreen(\'grafico-medicoes\')"]');
if (graficoBtn) {
    graficoBtn.addEventListener('click', function() {
        showScreen('grafico-medicoes');
        exibirGrafico(); // Chama a função para exibir o gráfico
    });
}

//7 Função para salvar a dose de insulina no localStorage
function salvarInsulina(tipo, dose, dataHora) {
    const userEmail = localStorage.getItem('loggedInUser');
    let insulina = JSON.parse(localStorage.getItem(userEmail + '-insulina')) || [];

    insulina.push({ tipo, dose, dataHora });
    localStorage.setItem(userEmail + '-insulina', JSON.stringify(insulina));

    exibirUltimaDose();
}

//7.1 Função para exibir a última dose de insulina
function exibirUltimaDose() {
    const userEmail = localStorage.getItem('loggedInUser');
    let insulina = JSON.parse(localStorage.getItem(userEmail + '-insulina')) || [];

    const ultimoRegistroDiv = document.getElementById('ultimo-registro-insulina');
    if (insulina.length > 0) {
        const ultimaDose = insulina[insulina.length - 1];
        ultimoRegistroDiv.innerHTML = `
            <p>Tipo de Insulina: ${ultimaDose.tipo}</p>
            <p>Dose: ${ultimaDose.dose} unidades</p>
            <p>Data e Hora: ${new Date(ultimaDose.dataHora).toLocaleString()}</p>
        `;
    } else {
        ultimoRegistroDiv.innerHTML = '<p>Nenhuma dose registrada.</p>';
    }
}

// Função para exibir o histórico de doses
function exibirHistoricoInsulina() {
    const userEmail = localStorage.getItem('loggedInUser');
    let insulina = JSON.parse(localStorage.getItem(userEmail + '-insulina')) || [];

    const listaHistorico = document.getElementById('lista-historico-insulina');
    listaHistorico.innerHTML = '';

    if (insulina.length === 0) {
        listaHistorico.innerHTML = '<li>Nenhuma dose registrada.</li>';
    } else {
        insulina.forEach((dose, index) => {
            const item = document.createElement('li');
            item.textContent = `Dose ${index + 1}: Tipo: ${dose.tipo}, Dose: ${dose.dose} unidades, Data: ${new Date(dose.dataHora).toLocaleString()}`;
            listaHistorico.appendChild(item);
        });
    }
}

// Event listener para o formulário de insulina
document.getElementById('form-insulina').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo-insulina').value;
    const dose = document.getElementById('dose-insulina').value;
    const dataHora = document.getElementById('data-hora-insulina').value;

    salvarInsulina(tipo, dose, dataHora);
    alert('Dose registrada com sucesso!');
    exibirUltimaDose();
    exibirHistoricoInsulina();
});

// Função para exibir o histórico de doses em uma tabela
function exibirHistoricoInsulina() {
    const userEmail = localStorage.getItem('loggedInUser');
    let insulina = JSON.parse(localStorage.getItem(userEmail + '-insulina')) || [];

    const tabelaHistorico = document.getElementById('tabela-historico-insulina');
    tabelaHistorico.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

    if (insulina.length === 0) {
        tabelaHistorico.innerHTML = '<tr><td colspan="3">Nenhuma dose registrada.</td></tr>';
    } else {
        // Adiciona as linhas da tabela com os dados das doses
        insulina.forEach((dose) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dose.tipo}</td>
                <td>${dose.dose} unidades</td>
                <td>${new Date(dose.dataHora).toLocaleString()}</td>
            `;
            tabelaHistorico.appendChild(row);
        });
    }
}

// Event listener para registrar nova refeição no Diário Alimentar
document.getElementById('form-diario-alimentar').addEventListener('submit', function(event) {
    event.preventDefault();

    const refeicao = document.getElementById('nome-refeicao').value;
    const alimentos = document.getElementById('alimentos').value;
    const dataHora = document.getElementById('data-hora-refeicao').value;

    const userEmail = localStorage.getItem('loggedInUser');
    let diarioAlimentar = JSON.parse(localStorage.getItem(userEmail + '-diarioAlimentar')) || [];

    diarioAlimentar.push({ refeicao, alimentos, dataHora });
    localStorage.setItem(userEmail + '-diarioAlimentar', JSON.stringify(diarioAlimentar));

    // Atualiza a tabela após salvar a refeição
    atualizarTabelaDiarioAlimentar(diarioAlimentar);

    alert('Refeição registrada com sucesso!');
    showScreen('menu-principal'); // Volta para o menu principal após registrar
});

// Função para atualizar a tabela de refeições
function atualizarTabelaDiarioAlimentar(diarioAlimentar) {
    const tabela = document.getElementById('tabela-diario-alimentar');
    const lista = document.getElementById('lista-diario-alimentar');
    
    lista.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

    if (diarioAlimentar.length > 0) {
        tabela.classList.remove('hidden'); // Exibe a tabela se houver registros

        diarioAlimentar.forEach(refeicao => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${refeicao.refeicao}</td>
                <td>${refeicao.alimentos}</td>
                <td>${new Date(refeicao.dataHora).toLocaleString()}</td>
            `;
            lista.appendChild(linha);
        });
    } else {
        tabela.classList.add('hidden'); // Oculta a tabela se não houver registros
    }
}

// Exibir o Diário Alimentar com a tabela
function exibirDiarioAlimentar() {
    const userEmail = localStorage.getItem('loggedInUser');
    let diarioAlimentar = JSON.parse(localStorage.getItem(userEmail + '-diarioAlimentar')) || [];

    atualizarTabelaDiarioAlimentar(diarioAlimentar);
    showScreen('diario-alimentar'); // Exibe a tela de Diário Alimentar
}

// Função para gerar o relatório
function gerarRelatorio() {
    const userEmail = localStorage.getItem('loggedInUser');
    const medicoes = JSON.parse(localStorage.getItem(userEmail + '-measurements')) || [];
    const insulina = JSON.parse(localStorage.getItem(userEmail + '-insulina')) || [];
    const diarioAlimentar = JSON.parse(localStorage.getItem(userEmail + '-diarioAlimentar')) || [];

    let relatorioHTML = '<h3>Relatório Resumido</h3>';

    // Seção de Medições
    relatorioHTML += '<h4>Medições de Glicose</h4>';
    if (medicoes.length === 0) {
        relatorioHTML += '<p>Nenhuma medição registrada.</p>';
    } else {
        medicoes.forEach((medicao, index) => {
            relatorioHTML += `
                <p>Medição ${index + 1}: Glicose: ${medicao.nivelGlicose} mg/dL, Data: ${new Date(medicao.dataHora).toLocaleString()}</p>
            `;
        });
    }

    // Seção de Doses de Insulina
    relatorioHTML += '<h4>Rastreio de Insulina e Medicação</h4>';
    if (insulina.length === 0) {
        relatorioHTML += '<p>Nenhuma dose registrada.</p>';
    } else {
        insulina.forEach((dose, index) => {
            relatorioHTML += `
                <p>Dose ${index + 1}: Tipo: ${dose.tipo}, Dose: ${dose.dose} unidades, Data: ${new Date(dose.dataHora).toLocaleString()}</p>
            `;
        });
    }

    // Seção de Diário Alimentar
    relatorioHTML += '<h4>Diário Alimentar</h4>';
    if (diarioAlimentar.length === 0) {
        relatorioHTML += '<p>Nenhuma refeição registrada.</p>';
    } else {
        diarioAlimentar.forEach((refeicao, index) => {
            relatorioHTML += `
                <p>Refeição ${index + 1}: Nome: ${refeicao.refeicao}, Alimentos: ${refeicao.alimentos}, Data: ${new Date(refeicao.dataHora).toLocaleString()}</p>
            `;
        });
    }

    // Exibir o relatório na tela
    document.getElementById('relatorio-conteudo').innerHTML = relatorioHTML;
}

// Inicializar a tela de Relatório
document.addEventListener('DOMContentLoaded', function() {
    const relatorioBtn = document.getElementById('btn-relatorio');
    if (relatorioBtn) {
        relatorioBtn.addEventListener('click', gerarRelatorio);
    }
});

// Função para exibir ou ocultar os links úteis
function toggleLinks() {
    const linksSection = document.getElementById('links-uteis');
    linksSection.classList.toggle('hidden');
}