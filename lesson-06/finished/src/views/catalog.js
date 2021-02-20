import { e, html } from '../dom.js';
import { getRecipes, getRecipeCount } from '../api/data.js';


const catalogTemplate = (recipes, goTo, page, pages) => html`
<section id="catalog">
    <header class="section-title">${pager(goTo, page, pages)}</header>
    ${recipes.map(r => recipePreview(r, goTo))}
    <footer class="section-title">${pager(goTo, page, pages)}</footer>
</section>`;

const recipePreview = (recipe, goTo) => html`
<article class="preview" @click=${()=> goTo('details', recipe._id)}>
    <div class="title">
        <h2>${recipe.name}</h2>
    </div>
    <div class="small"><img src=${recipe.img}></div>
</article>`;

const pager = (goTo, page, pages) => html`
Page ${page} of ${pages}
${page > 1 ? html`<a class="pager" href="/catalog" @click=${e => changePage(e, goTo, page - 1)}>&lt; Prev</a>` : ''}
${page < pages ? html`<a class="pager" href="/catalog" @click=${e => changePage(e, goTo, page + 1)}>Next &gt;</a>` : ''}`;

function changePage(e, goTo, newPage) {
    e.preventDefault();
    goTo('catalog', newPage);
}

export function setupCatalog(nav) {
    return showCatalog;

    async function showCatalog(page = 1) {
        const recipes = await getRecipes(page);
        const count = await getRecipeCount();
        const pages = Math.ceil(count / 5);

        return catalogTemplate(recipes, nav.goTo, page, pages);
    }
}