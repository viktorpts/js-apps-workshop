import { createNav } from './navigation.js';
import { logout as apiLogout } from './api/data.js';

import { setupCatalog } from './views/catalog.js';
import { setupLogin } from './views/login.js';
import { setupRegister } from './views/register.js';
import { setupCreate } from './views/create.js';
import { setupDetails } from './views/details.js';
import { setupEdit } from './views/edit.js';



window.addEventListener('load', async () => {
    const sections = {
        catalogSection: document.getElementById('catalog'),
        detailsSection: document.getElementById('details'),
        loginSection: document.getElementById('login'),
        registerSection: document.getElementById('register'),
        createSection: document.getElementById('create'),
        editSection: document.getElementById('edit')
    };
    Object.values(sections).forEach(s => {
        s.remove();
        s.style.display = 'block';
    });

    const main = document.querySelector('main');
    const nav = document.querySelector('nav');
    const navigation = createNav(main, nav);

    navigation.registerView('catalog', sections.catalogSection, setupCatalog, 'catalogLink');
    navigation.registerView('details', sections.detailsSection, setupDetails);
    navigation.registerView('login', sections.loginSection, setupLogin, 'loginLink');
    navigation.registerView('register', sections.registerSection, setupRegister, 'registerLink');
    navigation.registerView('create', sections.createSection, setupCreate, 'createLink');
    navigation.registerView('edit', sections.editSection, setupEdit);

    navigation.updateNav();
    navigation.goTo('catalog');


    document.getElementById('logoutBtn').addEventListener('click', logout);

    async function logout() {
        try {
            await apiLogout();
            navigation.updateNav();
            navigation.goTo('catalog');
        } catch (err) {
            alert(err.message);
        }
    }
});
