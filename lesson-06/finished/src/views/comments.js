import { html, until } from '../dom.js';


const commentsTemplate = (recipe) => html`
<div class="section-title">
    Comments for ${recipe.name}
</div>
<div>
    <form id="commentForm">
        <label>
            New comment
            <textarea name="content"></textarea>
        </label>
        <input type="submit" value="Add comment">
    </form>
</div>
<div class="comments">
    ${until(getComments(), 'Loading comments...')}
</div>`;

const commentsList = (comments) => html`
<ul>
    ${comments.map(comment)}
</ul>`;

const comment = (data) => html`
<li>${data}</li>`;

export function showComments(recipe) {
    return commentsTemplate(recipe);
}

async function getComments() {
    await new Promise(r => setTimeout(r, 1000));
    return commentsList([
        'a', 'b', 'c', 'd'
    ]);
}