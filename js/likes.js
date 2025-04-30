import { delay } from './utils.js';

export const handleLikeClick = (e, btn, comments, renderComments, elements) => {
    e.stopPropagation();
    const i = btn.dataset.index;
    if (comments[i].isLikeLoading) return;

    comments[i].isLikeLoading = true;
    btn.disabled = true;
    renderComments(elements);

    delay(2000)
        .then(() => {
            comments[i].likes = comments[i].isLiked
                ? comments[i].likes - 1
                : comments[i].likes + 1;
            comments[i].isLiked = !comments[i].isLiked;
            comments[i].isLikeLoading = false;
            renderComments(elements);
        })
        .catch((error) => {
            console.error("Like error:", error);
            comments[i].isLikeLoading = false;
            renderComments(elements);
        });
}; 