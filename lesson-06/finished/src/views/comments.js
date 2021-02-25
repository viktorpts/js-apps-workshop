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
        : html`<form><button class="button" @click=${toggleForm}>Add comment</button></form>`}
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

export function showComments(recipe, nav) {
    let formActive = false;
    nav.registerForm('commentForm', onSubmit);
    const commentsPromise = getComments();
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
        comments.unshift({
            author: sessionStorage.getItem('email'),
            content: data.content
        });
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