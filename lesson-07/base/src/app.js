import { createNav } from './navigation.js';
import { logout as apiLogout } from './api/data.js';

import { setupHome } from './views/home.js';
import { setupCatalog } from './views/catalog.js';
import { setupCreate } from './views/create.js';
import { setupLogin } from './views/login.js';
import { setupRegister } from './views/register.js';
import { setupDetails } from './views/details.js';
import { setupEdit, setupDeleted } from './views/edit.js';


window.addEventListener('load', async () => {
    const main = document.querySelector('main');
    const navbar = document.querySelector('nav');
    const navigation = createNav(main, navbar);

    navigation.registerView('home', setupHome);
    navigation.registerView('catalog', setupCatalog, 'catalogLink');
    navigation.registerView('details', setupDetails);
    navigation.registerView('login', setupLogin, 'loginLink');
    navigation.registerView('register', setupRegister, 'registerLink');
    navigation.registerView('create', setupCreate, 'createLink');
    navigation.registerView('edit', setupEdit);
    navigation.registerView('deleted', setupDeleted);

    navigation.setUserNav();
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Start application in catalog view
    navigation.goTo('home');


    async function logout() {
        try {
            await apiLogout();
            navigation.setUserNav();
            navigation.goTo('catalog');
        } catch (err) {
            alert(err.message);
        }
    }
});
