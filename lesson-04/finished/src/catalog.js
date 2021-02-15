import { e } from './dom.js';

async function getRecipes() {
    const response = await fetch('http://localhost:3030/data/recipes?select=' + encodeURIComponent('_id,name,img'));
    const recipes = await response.json();

    return recipes;
}

function createRecipePreview(recipe) {
    const result = e('article', { className: 'preview', onClick: () => onDetails(recipe._id) },
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img })),
    );

    return result;
}

let section;
let onDetails;

export function setupCatalog(targetSection, onDetailsCallback) {
    section = targetSection;
    onDetails = onDetailsCallback;
    updateCatalog();
}

export async function updateCatalog() {
    section.innerHTML = '';
    const recipes = await getRecipes();
    const cards = recipes.map(createRecipePreview);
    cards.forEach(c => section.appendChild(c));
}