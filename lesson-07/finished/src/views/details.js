import { html } from '../dom.js';
import { getRecipeById, deleteRecipeById } from '../api/data.js';
import { showComments } from './comments.js';


const detailsTemplate = (recipe, isOwner, onDelete) => html`
<section id="details">
    ${recipeCard(recipe, isOwner, onDelete)}
    ${showComments(recipe)}
</section>`;

const recipeCard = (recipe, isOwner, onDelete) => html`
<article>
    <h2>${recipe.name}</h2>
    <div class="band">
        <div class="thumb"><img src=${'/' + recipe.img}></div>
        <div class="ingredients">
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.ingredients.map(i => html`<li>${i}</li>`)}
            </ul>
        </div>
    </div>
    <div class="description">
        <h3>Preparation:</h3>
        ${recipe.steps.map(s => html`<p>${s}</p>`)}
    </div>
    ${isOwner
        ? html`
    <div class="controls">
        <a class="actionLink" href=${'/edit/' + recipe._id}>\u270E Edit</a>
        <a class="actionLink" href="javascript:void(0)" @click=${onDelete}>\u2716 Delete</a>
    </div>`
        : ''}
</article>`;


export function setupDetails() {
    return showDetails;

    async function showDetails(context) {
        const id = context.params.id;
        const recipe = await getRecipeById(id);

        const userId = sessionStorage.getItem('userId');
        const isOwner = userId != null && recipe._ownerId == userId;

        return detailsTemplate(recipe, isOwner, () => onDelete(recipe, () => context.page.redirect('/deleted/' + id)));
    }

    async function onDelete(recipe, onSuccess) {
        const confirmed = confirm(`Are you sure you want to delete ${recipe.name}?`);
        if (confirmed) {
            try {
                await deleteRecipeById(recipe._id);
                onSuccess();
            } catch (err) {
                alert(err.message);
            }
        }
    }
}
