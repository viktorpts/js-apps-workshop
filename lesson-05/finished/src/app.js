import { createNav } from './navigation.js';
import { logout as apiLogout } from './api/data.js';

import { setupCatalog } from './catalog.js';
import { setupCreate } from './create.js';
import { setupLogin } from './login.js';
import { setupRegister } from './register.js';
import { setupDetails } from './details.js';
import { setupEdit } from './edit.js';


window.addEventListener('load', async () => {
    const main = document.querySelector('main');
    const navbar = document.querySelector('nav');
    const navigation = createNav(main, navbar);

    navigation.registerView('catalog', document.getElementById('catalog'), setupCatalog, 'catalogLink');
    navigation.registerView('details', document.getElementById('details'), setupDetails);
    navigation.registerView('login', document.getElementById('login'), setupLogin, 'loginLink');
    navigation.registerView('register', document.getElementById('register'), setupRegister, 'registerLink');
    navigation.registerView('create', document.getElementById('create'), setupCreate, 'createLink');
    navigation.registerView('edit', document.getElementById('edit'), setupEdit);
    document.getElementById('views').remove();

    navigation.setUserNav();
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Start application in catalog view
    navigation.goTo('catalog');


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
