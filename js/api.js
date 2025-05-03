import {getAuthHeader} from './auth.js';

const API_URL = "https://wedev-api.sky.pro/api/v2/ttttemaa/comments";

export const getComments = () => {
    return fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                if (response.status >= 500 && response.status < 600) {
                    throw new Error("Сервер сломался, попробуй позже");
                }
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        });
};

export const addComment = (text) => {
    return fetch(API_URL, {
        method: "POST",
        headers: {
            ...getAuthHeader(),
        },
        body: JSON.stringify({
            text: text,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    if (response.status === 400) {
                        throw new Error(errorData.error || "Комментарий должен быть не короче 3 символов");
                    }
                    if (response.status === 401) {
                        throw new Error("Для добавления комментария необходимо авторизоваться");
                    }
                    if (response.status >= 500 && response.status < 600) {
                        throw new Error("Сервер сломался, попробуй позже");
                    }
                    throw new Error(errorData.error || `HTTP ${response.status}`);
                });
            }
            return response.json();
        });
}; 