import {login, registration, restoreUser} from './auth.js';

export const initializeLogin = () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    const user = restoreUser();
    if (user) {
        window.location.href = 'index.html';
        return;
    }

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
            console.log("Login successful, user:", user);
            if (user) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Login error:", error);
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
            const user = await registration(newLoginInput.value, nameInput.value, newPasswordInput.value);
            console.log("Registration successful, user:", user);
            if (user) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Registration error:", error);
            registerError.textContent = error.message;
        }
    });
}; 