import {renderLoginPage, renderCommentsPage} from './pages.js';

const API_URL = "https://wedev-api.sky.pro/api/v2/artem-korotkov/comments";
const USER_API_URL = "https://wedev-api.sky.pro/api/user";

let token = null;
let user = null;

export const getToken = () => {
    return token;
};

export const getUser = () => {
    return user;
};

export const isAuthorized = () => {
    return token !== null;
};

export const restoreUser = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
        token = savedToken;
        user = JSON.parse(savedUser);
        return user;
    }
    return null;
};

export const login = async (login, password) => {
    try {
        const response = await fetch(USER_API_URL + "/login", {
            method: "POST",
            body: JSON.stringify({
                login,
                password,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to login");
        }

        const data = await response.json();
        token = data.user.token;
        user = {
            name: data.user.name,
            login: data.user.login
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        renderCommentsPage();
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const register = async (name, login, password) => {
    try {
        const response = await fetch(USER_API_URL, {
            method: "POST",
            body: JSON.stringify({
                name,
                login,
                password,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to register");
        }

        const data = await response.json();
        token = data.user.token;
        user = {
            name: data.user.name,
            login: data.user.login
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        renderCommentsPage();
        return data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const logout = () => {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    renderLoginPage();
};

export const getAuthHeader = () => {
    if (!user || !user.token) {
        return {};
    }
    return {
        'Authorization': `Bearer ${user.token}`,
    };
};

export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
}; 