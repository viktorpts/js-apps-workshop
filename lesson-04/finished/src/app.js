import { setupCatalog, updateCatalog } from './catalog.js';
import { setupLogin } from './login.js';
import { setupRegister } from './register.js';
import { setupCreate } from './create.js';
import { setupDetails, loadRecipe } from './details.js';
import { setupEdit, updateEdit } from './edit.js';


window.addEventListener('load', async () => {
    updateNav();

    const main = document.querySelector('main');
    const nav = document.querySelector('nav');

    const links = {
        'catalogLink': () => {
            updateCatalog(main, sections.catalogSection);
            showSection(sections.catalogSection);
        },
        'createLink': () => showSection(sections.createSection),
        'loginLink': () => showSection(sections.loginSection),
        'registerLink': () => showSection(sections.registerSection),
    };

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

    setupCatalog(sections.catalogSection, (recipeId) => {
        loadRecipe(recipeId);
        showSection(sections.detailsSection);
    });
    setupDetails(sections.detailsSection, (recipeId) => {
        updateEdit(recipeId);
        showSection(sections.editSection);
    });
    setupLogin(sections.loginSection, () => {
        activeNav('catalogLink');
        updateCatalog();
        updateNav();
        showSection(sections.catalogSection);
    });
    setupRegister(sections.registerSection, () => {
        activeNav('catalogLink');
        updateCatalog();
        updateNav();
        showSection(sections.catalogSection);
    });
    setupCreate(sections.createSection, () => {
        activeNav('catalogLink');
        updateCatalog();
        showSection(sections.catalogSection);
    });
    setupEdit(sections.editSection, (recipeId) => {
        loadRecipe(recipeId);
        showSection(sections.detailsSection);
    });

    showSection(sections.catalogSection);

    setupNavigation();

    function setupNavigation() {
        document.getElementById('logoutBtn').addEventListener('click', logout);

        nav.addEventListener('click', (ev) => {
            if (ev.target.tagName == 'A') {
                const handler = links[ev.target.id];
                if (handler) {
                    ev.preventDefault();
                    activeNav(ev.target.id);
                    handler();
                }
            }
        });
    }

    function showSection(section) {
        Object.values(sections).forEach(s => s.remove());
        main.appendChild(section);
    }

    function activeNav(targetId) {
        [...nav.querySelectorAll('a')].forEach(a => a.id == targetId ? a.classList.add('active') : a.classList.remove('active'));
    }

    function updateNav() {
        if (sessionStorage.getItem('authToken') != null) {
            document.getElementById('user').style.display = 'inline-block';
            document.getElementById('guest').style.display = 'none';
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

            activeNav('catalogLink');
            updateCatalog(main, sections.catalogSection);
            updateNav();
            showSection(sections.catalogSection);
        } else {
            console.error(await response.json());
        }
    }
});
