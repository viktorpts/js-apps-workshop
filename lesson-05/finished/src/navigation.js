export function createNav(main, navbar) {
    const views = {};
    const links = {};

    setupNavigation();

    const navigator = {
        registerView,
        goTo,
        setUserNav
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
        main.innerHTML = '';
        const result = await views[name](...params);
        main.appendChild(result);
    }

    function registerView(name, section, setup, navId) {
        const execute = setup(section, navigator);

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
}

