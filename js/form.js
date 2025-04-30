import { delay } from './utils.js';
import { addComment, getComments } from './api.js';
import { initializeComments, renderComments } from './comments.js';

export let formData = { name: "", text: "" };

export const handleFormSubmit = (elements) => {
    const name = elements.name.value.trim();
    const text = elements.text.value.trim();
    
    if (name.length < 3 || text.length < 3) {
        alert("Имя и комментарий должны быть не короче 3 символов");
        return Promise.resolve();
    }

    elements.addForm.style.display = "none";
    elements.commentLoading.style.display = "block";
    elements.button.disabled = true;

    const handleSuccess = () => {
        return getComments()
            .then(({ comments }) => {
                initializeComments(comments);
                renderComments(elements);
                elements.name.value = "";
                elements.text.value = "";
                formData.name = "";
                formData.text = "";
            });
    };

    const handleError = (error, isRetry = false) => {
        console.error("Post error:", error);
        if (error.message === "Сервер сломался, попробуй позже" && !isRetry) {
            return delay(1000).then(() => submitComment(name, text, true));
        }
        if (error.name === "TypeError" || error.message.includes("Network")) {
            alert("Проверьте подключение к интернету и попробуйте позже");
        } else {
            alert(error.message || "Ошибка добавления комментария");
        }
    };

    const submitComment = (name, text, isRetry = false) => {
        return addComment(name, text, isRetry)
            .then(handleSuccess)
            .catch((error) => handleError(error, isRetry))
            .finally(() => {
                elements.addForm.style.display = "block";
                elements.commentLoading.style.display = "none";
                elements.button.disabled = false;
            });
    };

    return submitComment(name, text);
};

export const initializeForm = (elements) => {
    elements.name.addEventListener("input", () => {
        formData.name = elements.name.value;
    });

    elements.text.addEventListener("input", () => {
        formData.text = elements.text.value;
    });

    elements.button.addEventListener("click", () => {
        handleFormSubmit(elements);
    });
};

export const restoreFormData = (elements) => {
    elements.name.value = formData.name;
    elements.text.value = formData.text;
}; 