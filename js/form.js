import {delay} from './utils.js';
import {addComment, getComments} from './api.js';
import {initializeComments, renderComments} from './comments.js';
import {isAuthorized} from './auth.js';

export let formData = {text: ""};

export const handleFormSubmit = (elements) => {
    if (!isAuthorized()) {
        alert("Для добавления комментария необходимо авторизоваться");
        window.location.href = 'login.html';
        return Promise.resolve();
    }

    const text = elements.text.value.trim();

    if (text.length < 3) {
        alert("Комментарий должен быть не короче 3 символов");
        return Promise.resolve();
    }

    elements.addForm.style.display = "none";
    elements.commentLoading.style.display = "block";
    elements.button.disabled = true;

    const handleSuccess = () => {
        return getComments()
            .then(({comments}) => {
                initializeComments(comments);
                renderComments(elements);
                elements.text.value = "";
                formData.text = "";
            });
    };

    const handleError = (error) => {
        console.error("Post error:", error);
        if (error.name === "TypeError" || error.message.includes("Network")) {
            alert("Проверьте подключение к интернету и попробуйте позже");
        } else {
            alert(error.message || "Ошибка добавления комментария");
        }
    };

    return addComment(text)
        .then(handleSuccess)
        .catch(handleError)
        .finally(() => {
            elements.addForm.style.display = "block";
            elements.commentLoading.style.display = "none";
            elements.button.disabled = false;
        });
};

export const initializeForm = (elements) => {
    elements.text.addEventListener("input", () => {
        formData.text = elements.text.value;
    });

    elements.button.addEventListener("click", (e) => {
        e.preventDefault();
        handleFormSubmit(elements);
    });
};

export const restoreFormData = (elements) => {
    elements.text.value = formData.text;
}; 