const API_URL = "https://wedev-api.sky.pro/api/v1/ttttemaa/comments";

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

export const addComment = (name, text, isRetry = false) => {
    return fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            name,
            text,
            forceError: isRetry,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Имя и комментарий должны быть не короче 3 символов");
                }
                if (response.status >= 500 && response.status < 600) {
                    throw new Error("Сервер сломался, попробуй позже");
                }
                return response.json().then((errorData) => {
                    throw new Error(errorData.error || `HTTP ${response.status}`);
                });
            }
            return response.json();
        });
}; 