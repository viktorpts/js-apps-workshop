import { e } from '../dom.js';
import { getRecent } from '../api/data.js';


export function setupHome(section, nav) {
    const container = section.querySelector('.recent-recipes');
    return showHome;

    async function showHome() {
        container.innerHTML = 'Loading&hellip;';

        const recipes = await getRecent();
        const cards = recipes.map(createRecipePreview);

        const fragment = document.createDocumentFragment();

        while (cards.length > 0) {
            fragment.appendChild(cards.shift());
            if (cards.length > 0) {
                fragment.appendChild(createSpacer());
            }
        }
        container.innerHTML = '';
        container.appendChild(fragment);

        return section;
    }

    function createRecipePreview(recipe) {
        const result = e('article', { className: 'recent', onClick: () => nav.goTo('details', recipe._id) },
            e('div', { className: 'recent-preview' }, e('img', { src: recipe.img })),
            e('div', { className: 'recent-title' }, recipe.name),
        );

        return result;
    }

    function createSpacer() {
        return e('div', { className: 'recent-space' });
    }

}