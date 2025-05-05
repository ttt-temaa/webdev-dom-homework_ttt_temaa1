import {getUser, isAuthorized, logout, login, register} from './auth.js';
import {getComments, addComment} from './api.js';

// Шаблоны страниц
const loginPage = `
    <div class="container">
        <div class="auth-forms">
            <div class="login-form">
                <h2>Login</h2>
                <form id="login-form">
                    <input type="text" id="login" placeholder="Login" required>
                    <input type="password" id="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <div id="login-error" class="error-message"></div>
            </div>

            <div class="register-form">
                <h2>Register</h2>
                <form id="register-form">
                    <input type="text" id="name" placeholder="Name" required>
                    <input type="text" id="new-login" placeholder="Login" required>
                    <input type="password" id="new-password" placeholder="Password" required>
                    <button type="submit">Register</button>
                </form>
                <div id="register-error" class="error-message"></div>
            </div>
        </div>
    </div>
`;

const commentsPage = `
    <div class="container">
        <div class="auth-controls">
            <button class="logout-button">Выйти</button>
        </div>
        <div class="comments-loading">Загрузка комментариев...</div>
        <ul class="comments" style="display: none;"></ul>
        <div class="add-form" style="display: none;">
            <label>
                <input type="text" class="add-form-name" placeholder="Введите ваше имя" readonly/>
            </label>
            <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
            <div class="add-form-row">
                <button class="add-form-button">Написать</button>
            </div>
        </div>
        <div class="auth-link" style="display: none;">
            <p>Чтобы добавить комментарий, <a href="#" class="login-link">авторизуйтесь</a></p>
        </div>
        <div class="comment-loading" style="display: none;">Комментарий добавляется...</div>
    </div>
`;

const renderLoginPage = () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-form">
            <h2>Вход в систему</h2>
            <form id="loginForm">
                <input type="text" id="loginInput" placeholder="Логин" required>
                <input type="password" id="password" placeholder="Пароль" required>
                <button type="submit">Войти</button>
            </form>
            <div id="loginError" class="error-message"></div>
            <p>Нет аккаунта? <a href="#" id="showRegister">Зарегистрироваться</a></p>
        </div>
    `;

    const loginForm = document.getElementById('loginForm');
    const showRegisterLink = document.getElementById('showRegister');
    const errorElement = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorElement.textContent = ''; // Очищаем предыдущие ошибки

        const loginValue = document.getElementById('loginInput').value;
        const password = document.getElementById('password').value;

        try {
            await login(loginValue, password);
        } catch (error) {
            errorElement.textContent = error.message || 'Ошибка при входе в систему';
        }
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderRegisterPage();
    });
};

const renderRegisterPage = () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="register-form">
            <h2>Регистрация</h2>
            <form id="registerForm">
                <input type="text" id="name" placeholder="Имя" required>
                <input type="text" id="login" placeholder="Логин" required>
                <input type="password" id="password" placeholder="Пароль" required>
                <button type="submit">Зарегистрироваться</button>
            </form>
            <div id="registerError" class="error-message"></div>
            <p>Уже есть аккаунт? <a href="#" id="showLogin">Войти</a></p>
        </div>
    `;

    const registerForm = document.getElementById('registerForm');
    const showLoginLink = document.getElementById('showLogin');
    const errorElement = document.getElementById('registerError');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorElement.textContent = ''; // Очищаем предыдущие ошибки

        const name = document.getElementById('name').value;
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        try {
            await register(name, login, password);
        } catch (error) {
            if (error.message.includes('уже существует')) {
                errorElement.textContent = 'Этот логин уже занят. Пожалуйста, выберите другой.';
            } else {
                errorElement.textContent = error.message || 'Произошла ошибка при регистрации';
            }
        }
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderLoginPage();
    });
};

const renderCommentsPage = async () => {
    const app = document.getElementById('app');
    const user = getUser();

    app.innerHTML = `
        <div class="comments-container">
            <div class="header">
                <h2>Комментарии</h2>
                <div class="user-info">
                    <span>Привет, ${user.name}!</span>
                    <button id="logoutButton">Выйти</button>
                </div>
            </div>
            <div class="comments-list" id="commentsList">
                <div class="loading">Загрузка комментариев...</div>
            </div>
            <form id="addCommentForm" class="add-comment-form">
                <textarea id="commentText" placeholder="Введите ваш комментарий" required></textarea>
                <button type="submit">Написать</button>
            </form>
        </div>
    `;

    const commentsList = document.getElementById('commentsList');
    const addCommentForm = document.getElementById('addCommentForm');
    const logoutButton = document.getElementById('logoutButton');

    try {
        const comments = await getComments();
        renderComments(comments);
    } catch (error) {
        commentsList.innerHTML = `<div class="error">Ошибка загрузки комментариев: ${error.message}</div>`;
    }

    addCommentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = document.getElementById('commentText').value;

        try {
            await addComment(text);
            const comments = await getComments();
            renderComments(comments);
            addCommentForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });

    logoutButton.addEventListener('click', () => {
        logout();
    });
};

const renderComments = (comments) => {
    const commentsList = document.getElementById('commentsList');

    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев</div>';
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="author">${comment.author.name}</span>
                <span class="date">${new Date(comment.date).toLocaleString()}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
};

const initializeLogin = () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');

        if (!loginInput.value || !passwordInput.value) {
            loginError.textContent = "Пожалуйста, заполните все поля";
            return;
        }

        try {
            const user = await login(loginInput.value, passwordInput.value);
            if (user) {
                renderCommentsPage();
            }
        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.textContent = '';

        const nameInput = document.getElementById('name');
        const newLoginInput = document.getElementById('new-login');
        const newPasswordInput = document.getElementById('new-password');

        if (!nameInput.value || !newLoginInput.value || !newPasswordInput.value) {
            registerError.textContent = "Пожалуйста, заполните все поля";
            return;
        }

        try {
            const user = await register(newLoginInput.value, nameInput.value, newPasswordInput.value);
            if (user) {
                renderCommentsPage();
            }
        } catch (error) {
            registerError.textContent = error.message;
        }
    });
};

const initializeComments = () => {
    const elements = {
        list: document.querySelector(".comments"),
        commentsLoading: document.querySelector(".comments-loading"),
        name: document.querySelector(".add-form-name"),
        text: document.querySelector(".add-form-text"),
        button: document.querySelector(".add-form-button"),
        addForm: document.querySelector(".add-form"),
        commentLoading: document.querySelector(".comment-loading"),
        authLink: document.querySelector(".auth-link"),
        logoutButton: document.querySelector(".logout-button"),
        loginLink: document.querySelector(".login-link"),
    };

    const user = restoreUser();
    if (!isAuthorized()) {
        elements.addForm.style.display = "none";
        elements.authLink.style.display = "block";
        elements.logoutButton.style.display = "none";
        elements.loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            renderLoginPage();
        });
    } else {
        elements.addForm.style.display = "block";
        elements.authLink.style.display = "none";
        elements.logoutButton.style.display = "block";
        elements.name.value = user.name;
        elements.name.readOnly = true;

        elements.logoutButton.addEventListener("click", () => {
            logout();
            renderLoginPage();
        });
    }

    getComments()
        .then(({comments}) => {
            initializeComments(comments);
            renderComments(elements);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            if (error.name === "TypeError" || error.message.includes("Network")) {
                alert("Проверьте подключение к интернету и попробуйте позже");
            } else {
                alert(error.message || "Не удалось загрузить комментарии");
            }
        })
        .finally(() => {
            elements.commentsLoading.style.display = "none";
            elements.list.style.display = "block";
        });

    initializeForm(elements);
    restoreFormData(elements);
};

export {renderLoginPage, renderRegisterPage, renderCommentsPage};