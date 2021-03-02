import { render } from './dom.js';


export function createNav(main, navbar) {
    const views = {};
    const links = {};
    const forms = {};

    setupNavigation();
    setupForms();

    const navigator = {
        registerView,
        goTo,
        setUserNav,
        registerForm
    };

    return navigator;

    function setupNavigation() {
        navbar.addEventListener('click', (ev) => {
            if (ev.target.tagName == 'A') {
                const handlerName = links[ev.target.id];
                if (handlerName) {
                    ev.preventDefault();
                    goTo(handlerName);
                }
            }
        });
    }

    async function goTo(name, ...params) {
        const result = await views[name](...params);
        render(result, main);
    }

    function registerView(name, setup, navId) {
        const execute = setup(navigator);

        views[name] = (...params) => {
            [...navbar.querySelectorAll('a')].forEach(a => a.classList.remove('active'));
            if (navId) {
                navbar.querySelector('#' + navId).classList.add('active');
            }
            return execute(...params);
        };
        if (navId) {
            links[navId] = name;
        }
    }

    function setUserNav() {
        if (sessionStorage.getItem('userToken') != null) {
            document.getElementById('user').style.display = 'inline-block';
            document.getElementById('guest').style.display = 'none';
        } else {
            document.getElementById('user').style.display = 'none';
            document.getElementById('guest').style.display = 'inline-block';
        }
    }

    function setupForms() {
        document.body.addEventListener('submit', onSubmit);
    }

    function registerForm(name, handler) {
        forms[name] = handler;
    }

    function onSubmit(ev) {
        const handler = forms[ev.target.id];
        if (typeof handler == 'function') {
            ev.preventDefault();
            const formData = new FormData(ev.target);
            const body = [...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {});
            handler(body);
        }
    }
}

