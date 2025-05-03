const API_URL = "https://wedev-api.sky.pro/api/user";
const COMMENTS_API_URL = "https://wedev-api.sky.pro/api/v2/ttttemaa/comments";

export let user = null;

const LOCAL_ADMIN = {
    id: 1,
    login: "admin",
    name: "Administrator",
    token: "admin-token"
};

export const login = (login, password) => {
    return fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({
            login: login,
            password: password,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Неверный логин или пароль");
                }
                throw new Error(`Ошибка HTTP ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Login response:", data);
            if (data.user) {
                user = data.user;
                localStorage.setItem("user", JSON.stringify(user));
                return user;
            } else {
                throw new Error("Ошибка авторизации: неверный ответ сервера");
            }
        });
};

export const registration = (login, name, password) => {
    return fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            login: login,
            name: name,
            password: password,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Пользователь с таким логином уже существует");
                }
                throw new Error(`Ошибка HTTP ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Registration response:", data);
            if (data.user) {
                user = data.user;
                localStorage.setItem("user", JSON.stringify(user));
                return user;
            } else {
                throw new Error("Ошибка регистрации: неверный ответ сервера");
            }
        });
};

export const logout = () => {
    user = null;
    localStorage.removeItem("user");
    window.location.href = 'login.html';
};

export const restoreUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        try {
            user = JSON.parse(savedUser);
            return user;
        } catch (error) {
            console.error("Ошибка при восстановлении пользователя:", error);
            user = null;
            localStorage.removeItem("user");
        }
    }
    return user;
};

export const getAuthHeader = () => {
    if (!user || !user.token) {
        return {};
    }
    return {
        'Authorization': `Bearer ${user.token}`,
    };
};

export const isAuthorized = () => {
    return !!user;
};

export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
}; 