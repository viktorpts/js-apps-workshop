import { html } from '../dom.js';
import { getRecipeById, editRecipe } from '../api/data.js';


const editTemplate = (recipe) => html`
<section id="create">
    <article>
        <h2>Edit Recipe</h2>
        <form id="editForm">
        <input type="hidden" name="_id" value=${recipe._id}>
            <label>Name: <input type="text" name="name" placeholder="Recipe name" .value=${recipe.name}></label>
            <label>Image: <input type="text" name="img" placeholder="Image URL" .value=${recipe.img}></label>
            <label class="ml">Ingredients: <textarea name="ingredients"
                    placeholder="Enter ingredients on separate lines"
                    .value=${recipe.ingredients.join('\n')}></textarea></label>
            <label class="ml">Preparation: <textarea name="steps"
                    placeholder="Enter preparation steps on separate lines"
                    .value=${recipe.steps.join('\n')}></textarea></label>
            <input type="submit" value="Save Changes">
        </form>
    </article>
</section>`;

export function setupEdit() {
    return showEdit;
    
    async function showEdit(context) {
        const recipeId = context.params.id;
        const recipe = await getRecipeById(recipeId);

        return editTemplate(recipe);
    }
}

export async function onEditSubmit(data, onSuccess) {
    const recipeId = data._id;
    const body = {
        name: data.name,
        img: data.img,
        ingredients: data.ingredients.split('\n').map(l => l.trim()).filter(l => l != ''),
        steps: data.steps.split('\n').map(l => l.trim()).filter(l => l != '')
    };

    try {
        await editRecipe(recipeId, body);
        onSuccess(recipeId);
    } catch (err) {
        alert(err.message);
    }
}

export function setupDeleted() {
    return () => html`
    <section id="details">
        <article>
            <h2>Recipe deleted</h2>
        </article>
    </section>`;
}