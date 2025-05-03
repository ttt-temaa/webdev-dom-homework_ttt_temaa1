import {getComments} from './api.js';
import {initializeComments, renderComments} from './comments.js';
import {initializeForm, restoreFormData} from './form.js';
import {isAuthorized, restoreUser, user} from './auth.js';

export const initialize = () => {
    const elements = {
        list: document.querySelector(".comments"),
        commentsLoading: document.querySelector(".comments-loading"),
        name: document.querySelector(".add-form-name"),
        text: document.querySelector(".add-form-text"),
        button: document.querySelector(".add-form-button"),
        addForm: document.querySelector(".add-form"),
        commentLoading: document.querySelector(".comment-loading"),
        authLink: document.querySelector(".auth-link"),
    };

    const user = restoreUser();

    if (!isAuthorized()) {
        elements.addForm.style.display = "none";
        elements.authLink.style.display = "block";
        elements.authLink.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    } else {
        elements.addForm.style.display = "block";
        elements.authLink.style.display = "none";
        elements.name.value = user.name;
        elements.name.readOnly = true;
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