import { html } from '../dom.js';
import { getRecipes, getRecipeCount } from '../api/data.js';


const catalogTemplate = (recipes, page, pages, search) => html`
<section id="catalog">
    <div class="section-title">
        <form id="searchForm">
            <input type="text" name="search" value=${search || ''}>
            <input type="submit" value="Search">
        </form>
    </div>
    <header class="section-title">${pager(page, pages, search)}</header>
    ${recipes.map(recipePreview)}
    <footer class="section-title">${pager(page, pages, search)}</footer>
</section>`;

const recipePreview = (recipe) => html`
<a class="card" href=${`/details/${recipe._id}`}> <article class="preview">
    <div class="title">
        <h2>${recipe.name}</h2>
    </div>
    <div class="small"><img src=${'/' + recipe.img}></div>
    </article>
</a>`;

const pager = (page, pages, search) => html`
Page ${page} of ${pages}
${page > 1 ? html`<a class="pager" href=${'/catalog/' + (page - 1) + (search ? `?search=${search}` : '')}>&lt;
    Prev</a>` : ''}
${page < pages ? html`<a class="pager" href=${'/catalog/' + (page + 1) + (search ? `?search=${search}` : '')}>Next
    &gt;</a>` : ''}`;

export function setupCatalog() {
    return showCatalog;

    async function showCatalog(context) {
        const search = readSearchParam(context.querystring);
        const page = Number(context.params.page) || 1;
        const recipes = await getRecipes(page, search);
        const count = await getRecipeCount(search);
        const pages = Math.ceil(count / 5);

        return catalogTemplate(recipes, page, pages, search);
    }
}

function readSearchParam(query = '') {
    return query.split('=')[1];
}