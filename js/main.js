import {getComments} from './api.js';
import {initializeComments, renderComments} from './comments.js';
import {initializeForm, restoreFormData} from './form.js';
import {isAuthorized, restoreUser, logout} from './auth.js';
import {renderLoginPage, renderCommentsPage} from './pages.js';

const renderMainPage = () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
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

    const elements = {
        list: document.querySelector(".comments"),
        commentsLoading: document.querySelector(".comments-loading"),
        name: document.querySelector(".add-form-name"),
        text: document.querySelector(".add-form-text"),
        button: document.querySelector(".add-form-button"),
        addForm: document.querySelector(".add-form"),
        commentLoading: document.querySelector(".comment-loading"),
        authLink: document.querySelector(".auth-link"),
        loginLink: document.querySelector(".login-link"),
    };

    const user = restoreUser();

    if (!isAuthorized()) {
        elements.addForm.style.display = "none";
        elements.authLink.style.display = "block";
        elements.loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            renderLoginPage();
        });
    } else {
        elements.addForm.style.display = "block";
        elements.authLink.style.display = "none";
        elements.name.value = user.name;
        elements.name.readOnly = true;
    }

    getComments()
        .then((comments) => {
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

    if (elements.addForm) {
        initializeForm(elements);
        restoreFormData(elements);
    }
};

const initialize = () => {
    renderMainPage();
};

initialize();