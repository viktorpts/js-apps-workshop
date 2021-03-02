import { html } from '../dom.js';
import { regster } from '../api/data.js';


const registerTemplate = () => html`
<section id="register">
    <article>
        <h2>Register</h2>
        <form id="registerForm">
            <label>E-mail: <input type="text" name="email"></label>
            <label>Password: <input type="password" name="password"></label>
            <label>Repeat: <input type="password" name="rePass"></label>
            <input type="submit" value="Register">
        </form>
    </article>
</section>`;


export function setupRegister(nav) {
    nav.registerForm('registerForm', onSubmit);
    return showRegister;

    function showRegister() {
        return registerTemplate();
    }

    async function onSubmit(data) {
        if (data.password != data.rePass) {
            return alert('Passwords don\'t match');
        }

        try {
            await regster(data.email, data.password);
            nav.setUserNav();
            nav.goTo('catalog');
        } catch (err) {
            alert(err.message);
        }
    }
}