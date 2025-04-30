export const escapeHTML = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })}`;
};

export const delay = (interval = 300) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}; 