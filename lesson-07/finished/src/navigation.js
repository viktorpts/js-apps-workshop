import { render } from './dom.js';


export function createNav(main, navbar) {
    const views = {};
    const links = {};
    const forms = {};

    setupForms();
    setUserNav();

    const navigator = {
        registerView,
        setUserNav,
        registerForm
    };

    return navigator;

    function registerView(name, setup, navId) {
        const execute = setup();

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

        return async (...params) => render(await views[name](...params), main);
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

    function registerForm(name, handler, onSuccess) {
        forms[name] = {
            handler,
            onSuccess
        };
    }

    function onSubmit(ev) {
        const { handler, onSuccess } = forms[ev.target.id] || {};
        if (typeof handler == 'function') {
            ev.preventDefault();
            const formData = new FormData(ev.target);
            const body = [...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {});
            handler(body, onSuccess);
        }
    }
}

