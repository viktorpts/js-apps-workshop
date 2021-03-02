import { html } from '../dom.js';
import { getRecipes, getRecipeCount } from '../api/data.js';


const catalogTemplate = (recipes, page, pages) => html`
<section id="catalog">
    <header class="section-title">${pager(page, pages)}</header>
    ${recipes.map(recipePreview)}
    <footer class="section-title">${pager(page, pages)}</footer>
</section>`;

const recipePreview = (recipe) => html`
<a class="card" href=${`/details/${recipe._id}`}>
    <article class="preview">
        <div class="title">
            <h2>${recipe.name}</h2>
        </div>
        <div class="small"><img src=${'/' + recipe.img}></div>
    </article>
</a>`;

const pager = (page, pages) => html`
Page ${page} of ${pages}
${page > 1 ? html`<a class="pager" href=${'/catalog/' + (page - 1)}>&lt; Prev</a>` : ''}
${page < pages ? html`<a class="pager" href=${'/catalog/' + (page + 1)}>Next &gt;</a>` : ''}`;

export function setupCatalog() {
    return showCatalog;

    async function showCatalog(context) {
        const page = Number(context.params.page) || 1;
        const recipes = await getRecipes(page);
        const count = await getRecipeCount();
        const pages = Math.ceil(count / 5);

        return catalogTemplate(recipes, page, pages);
    }
}