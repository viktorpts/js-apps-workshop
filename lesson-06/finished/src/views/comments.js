import { render, html, until } from '../dom.js';


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
    : html`<button @click=${toggleForm}>Add comment</button>`}
</article>`;

const commentsList = (comments) => html`
<ul>
    ${comments.map(comment)}
</ul>`;

const comment = (data) => html`
<li class="comment">
    <header>${data.author}</header>
    <p>${data.content}</p>
</li>`;

export function showComments(recipe) {
    let formActive = false;
    const comments = getComments();
    const result = document.createElement('div');
    renderTemplate();

    return result;

    function renderTemplate() {
        render(commentsTemplate(recipe, commentFormTemplate(formActive, toggleForm), comments), result);
    }

    function toggleForm() {
        formActive = !formActive;
        renderTemplate();
    }
}




/// TEMP
async function getComments() {
    await new Promise(r => setTimeout(r, 1000));
    return [
        {
            author: 'peter',
            content: 'a'
        },
        {
            author: 'john',
            content: 'b'
        },
        {
            author: 'george',
            content: 'c'
        },
        {
            author: 'mary',
            content: 'd'
        }
    ];
}