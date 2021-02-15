import { showCatalog } from './catalog.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';
import { setupCreate, showCreate } from './create.js';


window.addEventListener('load', async () => {
    updateNav();

    const main = document.querySelector('main');

    const sections = {
        catalogSection: document.getElementById('catalog'),
        loginSection: document.getElementById('login'),
        registerSection: document.getElementById('register'),
        createSection: document.getElementById('create'),
        detailsSection: document.getElementById('details'),
        editSection: document.getElementById('edit')
    };

    Object.values(sections).forEach(s => {
        s.remove();
        s.style.display = 'block';
    });

    setupLogin(sections.loginSection, () => {
        clearSections();
        showCatalog(main, sections.catalogSection);
        updateNav();
    });
    setupRegister(sections.registerSection, () => {
        clearSections();
        showCatalog(main, sections.registerSection);
        updateNav();
    });
    setupCreate(sections.createSection, () => {
        clearSections();
        showCatalog(main, sections.createSection);
        updateNav();
    });

    showCatalog(main, sections.catalogSection);

    setupNavigation();

    function setupNavigation() {
        const links = {
            'catalogLink': () => showCatalog(main, sections.catalogSection),
            'createLink': () => showCreate(main, sections.createSection),
            'loginLink': () => showLogin(main, sections.loginSection),
            'registerLink': () => showRegister(main, sections.registerSection),
        };

        const nav = document.querySelector('nav');
        nav.addEventListener('click', (ev) => {
            if (ev.target.tagName == 'A') {
                const handler = links[ev.target.id];
                if (handler) {
                    ev.preventDefault();
                    clearSections();
                    [...nav.querySelectorAll('a')].forEach(a => a.classList.remove('active'));
                    ev.target.classList.add('active');
                    handler();
                }
            }
        });
    }

    function clearSections() {
        Object.values(sections).forEach(s => s.remove());
    }

    function updateNav() {
        if (sessionStorage.getItem('authToken') != null) {
            document.getElementById('user').style.display = 'inline-block';
            document.getElementById('guest').style.display = 'none';
            document.getElementById('logoutBtn').addEventListener('click', logout);
        } else {
            document.getElementById('user').style.display = 'none';
            document.getElementById('guest').style.display = 'inline-block';
        }
    }

    async function logout() {
        const response = await fetch('http://localhost:3030/users/logout', {
            method: 'get',
            headers: {
                'X-Authorization': sessionStorage.getItem('authToken')
            },
        });
        if (response.status == 200) {
            sessionStorage.removeItem('authToken');
            clearSections();
            showCatalog(main, sections.catalogSection);
            updateNav();
        } else {
            console.error(await response.json());
        }
    }
});

