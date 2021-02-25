import { render, html, until } from '../dom.js';
import { getCommentsByRecipeId, createComment } from '../api/data.js';


const commentsTemplate = (recipe, commentForm, comments) => html`
<div class="section-title">
    Comments for ${recipe.name}
</div>
${commentForm}
<div class="comments">
    ${until((async () => commentsList(await comments))(), 'Loading comments...')}
</div>`;

const commentFormTemplate = (active, toggleForm) => html`
<article class="new-comment">
    ${active
        ? html`
    <h2>New comment</h2>
    <form id="commentForm">
        <textarea name="content" placeholder="Type comment"></textarea>
        <input type="submit" value="Add comment">
    </form>`
        : html`<form><button class="button" @click=${toggleForm}>Add comment</button></form>`}
</article>`;

const commentsList = (comments) => html`
<ul>
    ${comments.map(comment)}
</ul>`;

const comment = (data) => html`
<li class="comment">
    <header>${data.author.email}</header>
    <p>${data.content}</p>
</li>`;

export function showComments(recipe, nav) {
    let formActive = false;
    nav.registerForm('commentForm', onSubmit);
    const commentsPromise = getCommentsByRecipeId(recipe._id);
    const result = document.createElement('div');
    renderTemplate(commentsPromise);

    return result;

    function renderTemplate(comments) {
        render(commentsTemplate(recipe, createForm(formActive, toggleForm), comments), result);
    }

    function toggleForm() {
        formActive = !formActive;
        renderTemplate(commentsPromise);
    }

    async function onSubmit(data) {
        toggleForm();
        const comments = await commentsPromise;

        const comment = {
            content: data.content,
            recipeId: recipe._id
        };

        const result = await createComment(comment);

        comments.unshift(result);
        renderTemplate(comments);
    }
}

function createForm(formActive, toggleForm) {
    const userId = sessionStorage.getItem('userId');
    if (userId == null) {
        return '';
    } else {
        return commentFormTemplate(formActive, toggleForm);
    }
}