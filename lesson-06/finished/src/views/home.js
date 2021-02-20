import { html } from '../dom.js';
import { getRecent } from '../api/data.js';


const homeTemplate = (recentRecipes, goTo) => html`
<section id="home">
    <div class="hero">
        <h2>Welcome to My Cookbook</h2>
    </div>
    <header class="section-title">Recently added recipes</header>
    <div class="recent-recipes">
        ${recentRecipes[0] ? recentRecipe(recentRecipes[0], goTo) : ''}
        ${spacer()}
        ${recentRecipes[1] ? recentRecipe(recentRecipes[1], goTo) : ''}
        ${spacer()}
        ${recentRecipes[2] ? recentRecipe(recentRecipes[2], goTo) : ''}
    </div>
    <footer class="section-title">
        <p>Browse all recipes in the <a href="/catalog">Catalog</a></p>
    </footer>
</section>`;

const recentRecipe = (recipe, goTo) => html`
<article class="recent" @click=${() => goTo('details', recipe._id)}>
    <div class="recent-preview"><img src=${recipe.img}></div>
    <div class="recent-title">${recipe.name}</div>
</article>`;

const spacer = () => html`<div class="recent-space"></div>`;

export function setupHome(nav) {
    return showHome;

    async function showHome() {
        const recipes = await getRecent();

        return homeTemplate(recipes, nav.goTo);
    }
}