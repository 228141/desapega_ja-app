// 1- Função para mostrar uma tela específica e ocultar as demais
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

// 2 Função para inicializar a página com base na URL ou exibir a tela padrão
function initializePage() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showScreen(hash);
    } else {
        showScreen('dashboard-screen'); // Tela padrão
    }
}

// 3 Função para registrar um novo usuário
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não correspondem!');
        return;
    }

    // Recupera usuários existentes do localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Verifica se o e-mail já está cadastrado
    if (users.some(user => user.email === email)) {
        alert('E-mail já cadastrado!');
        return;
    }

    // Adiciona o novo usuário
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Cadastro realizado com sucesso!');
    showScreen('dashboard-screen');
}

// 4 Função para lidar com o login do usuário
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Login bem-sucedido!');
        localStorage.setItem('loggedInUser', email); // Salva o e-mail do usuário logado
        window.location.href = 'page2.html'; // Redireciona para page2.html após o login
    } else {
        alert('E-mail ou senha inválidos!');
    }
}

// 5 Função para redefinir a senha do usuário
function handleResetPassword(event) {
    event.preventDefault();

    const email = document.getElementById('reset-email').value.trim();

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        // Para fins de demonstração, redefine a senha para 'newpassword'
        users[userIndex].password = 'newpassword';
        localStorage.setItem('users', JSON.stringify(users));
        alert('Senha redefinida para "newpassword". Por favor, faça login.');
        showScreen('login-screen');
    } else {
        alert('E-mail não encontrado!');
    }
}

// Inicialização das funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa a página padrão
    initializePage();

    // Event listener para o formulário de registro
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
});
