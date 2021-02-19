import { e } from '../dom.js';
import { getRecipes } from '../api/data.js';


export function setupCatalog(section, nav) {
    return showCatalog;

    async function showCatalog() {
        section.innerHTML = 'Loading&hellip;';
    
        const recipes = await getRecipes();
        const cards = recipes.map(createRecipePreview);
    
        const fragment = document.createDocumentFragment();
        cards.forEach(c => fragment.appendChild(c));
        section.innerHTML = '';
        section.appendChild(fragment);

        return section;
    }

    function createRecipePreview(recipe) {
        const result = e('article', { className: 'preview', onClick: () => nav.goTo('details', recipe._id) },
            e('div', { className: 'title' }, e('h2', {}, recipe.name)),
            e('div', { className: 'small' }, e('img', { src: recipe.img })),
        );
    
        return result;
    }
    
}