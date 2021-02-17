import createApi from './api.js';

const api = createApi(null, null, (msg) => alert(msg));

const endpoints = {
    RECIPE_LIST: 'data/recipes?select=' + encodeURIComponent('_id,name,img'),
    RECIPES: 'data/recipes',
    RECIPE_BY_ID: 'data/recipes/'
};

export const login = api.login.bind(api);
export const regster = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getRecipes() {
    return await api.get(endpoints.RECIPE_LIST);
}

export async function getRecipeById(id) {
    return await api.get(endpoints.RECIPE_BY_ID + id);
}

export async function createRecipe(recipe) {
    return await api.post(endpoints.RECIPES, recipe);
}

export async function editRecipe(id, recipe) {
    return await api.put(endpoints.RECIPE_BY_ID + id, recipe);
}

export async function deleteRecipeById(id) {
    return await api.delete(endpoints.RECIPE_BY_ID + id);
}