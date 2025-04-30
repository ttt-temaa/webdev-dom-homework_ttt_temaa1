import { escapeHTML, formatDate } from './utils.js';
import { handleLikeClick } from './likes.js';

export let comments = [];

export const renderComments = (elements) => {
    elements.list.innerHTML = comments
        .map(
            (c, i) => `
        <li class="comment" data-index="${i}">
          <div class="comment-header">
            <div class="head-name">${escapeHTML(c.name)}</div>
            <div class="head-time">${c.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">${escapeHTML(c.text)}</div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${c.likes}</span>
              <button class="like-button ${c.isLiked ? "-active-like" : ""} ${
                c.isLikeLoading ? "-loading-like" : ""
            }" data-index="${i}"></button>
            </div>
          </div>
        </li>`
        )
        .join("");

    elements.list.querySelectorAll(".like-button").forEach((btn) =>
        btn.addEventListener("click", (e) => handleLikeClick(e, btn, comments, renderComments, elements))
    );

    elements.list.querySelectorAll(".comment").forEach((comment) =>
        comment.addEventListener("click", () => {
            const i = comment.dataset.index;
            elements.text.value = `> ${escapeHTML(comments[i].text)}\n`;
            elements.name.value = comments[i].name;
            return {
                name: elements.name.value,
                text: elements.text.value,
            };
        })
    );
};

export const initializeComments = (data) => {
    comments = data.map((c) => ({
        name: c.author.name,
        date: formatDate(c.date),
        text: c.text,
        likes: 0,
        isLiked: false,
        isLikeLoading: false,
    }));
}; 