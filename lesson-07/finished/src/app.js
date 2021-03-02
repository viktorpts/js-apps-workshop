import page from '//unpkg.com/page/page.mjs';
import { render } from './dom.js';

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

    const homeView = createView(setupHome);
    const catalogView = createView(setupCatalog);

    page('/', homeView);
    page('/index.html', homeView);
    page('/catalog', catalogView);
    page('/catalog/:page', catalogView);
    page('/details/:id', createView(setupDetails));
    page('/login', createView(setupLogin));
    page('/register', createView(setupRegister));
    page('/create', createView(setupCreate));
    page('/edit/:id', createView(setupEdit));
    page('/deleted/:id', createView(setupDeleted));

    /*
    navigation.registerView('home', setupHome);
    navigation.registerView('catalog', setupCatalog, 'catalogLink');
    navigation.registerView('details', setupDetails);
    navigation.registerView('login', setupLogin, 'loginLink');
    navigation.registerView('register', setupRegister, 'registerLink');
    navigation.registerView('create', setupCreate, 'createLink');
    navigation.registerView('edit', setupEdit);
    navigation.registerView('deleted', setupDeleted);
    */

    navigation.setUserNav();
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Start application in catalog view
    //navigation.goTo('home');
    page();

    function createView(setup) {
        const view = setup(navigation);
        return async (...params) => render(await view(...params), main);
    }


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
