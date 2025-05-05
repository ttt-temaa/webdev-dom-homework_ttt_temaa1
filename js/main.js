import {getComments} from './api.js';
import {initializeComments, renderComments} from './comments.js';
import {initializeForm, restoreFormData} from './form.js';
import {isAuthorized, restoreUser, logout} from './auth.js';
import {renderLoginPage, renderCommentsPage} from './pages.js';

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
};

const initialize = () => {
    const user = restoreUser();

    if (!isAuthorized()) {
        renderLoginPage();
    } else {
        renderCommentsPage();
    }

    if (elements.commentsLoading) elements.commentsLoading.style.display = "block";
    if (elements.list) elements.list.style.display = "none";

    getComments()
        .then(({comments}) => {
            if (elements.list) {
                initializeComments(comments);
                renderComments(elements);
            }
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
            if (elements.commentsLoading) elements.commentsLoading.style.display = "none";
            if (elements.list) elements.list.style.display = "block";
        });

    if (elements.addForm) {
        initializeForm(elements);
        restoreFormData(elements);
    }
};

initialize();