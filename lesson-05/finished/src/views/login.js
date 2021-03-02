import { login } from '../api/data.js';


export function setupLogin(section, nav) {
    const form = section.querySelector('form');

    form.addEventListener('submit', (ev => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
    }));

    return showLogin;

    function showLogin() {
        return section;
    }

    async function onSubmit(data) {
        try {
            console.log('logging in');
            await login(data.email, data.password);
            nav.setUserNav();
            nav.goTo('catalog');
        } catch (err) {
            alert(err.message);
        }
    }
}