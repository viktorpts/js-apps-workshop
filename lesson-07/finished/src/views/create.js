import { html } from '../dom.js';
import { createRecipe } from '../api/data.js';


const createTemplate = () => html`
<section id="create">
    <article>
        <h2>New Recipe</h2>
        <form id="createForm">
            <label>Name: <input type="text" name="name" placeholder="Recipe name"></label>
            <label>Image: <input type="text" name="img" placeholder="Image URL"></label>
            <label class="ml">Ingredients: <textarea name="ingredients"
                    placeholder="Enter ingredients on separate lines"></textarea></label>
            <label class="ml">Preparation: <textarea name="steps"
                    placeholder="Enter preparation steps on separate lines"></textarea></label>
            <input type="submit" value="Create Recipe">
        </form>
    </article>
</section>`;

export function setupCreate() {
    return showCreate;

    function showCreate() {
        return createTemplate();
    }
}

export async function onCreateSubmit(data, onSuccess) {
    const body = {
        name: data.name,
        img: data.img,
        ingredients: data.ingredients.split('\n').map(l => l.trim()).filter(l => l != ''),
        steps: data.steps.split('\n').map(l => l.trim()).filter(l => l != '')
    };

    try {
        const result = await createRecipe(body);
        onSuccess(result._id);
    } catch (err) {
        alert(err.message);
    }
}