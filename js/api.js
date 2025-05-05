import {getToken} from './auth.js';

const API_URL = "https://wedev-api.sky.pro/api/v2/artem-korotkov/comments";

export const getComments = async () => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        return data.comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

export const addComment = async (text) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                text: text
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to add comment");
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}; 