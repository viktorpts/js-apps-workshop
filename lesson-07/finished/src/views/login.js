import { html } from '../dom.js';
import { login } from '../api/data.js';


const loginTemplate = () => html`
<section id="login">
    <article>
        <h2>Login</h2>
        <form id="loginForm">
            <label>E-mail: <input type="text" name="email"></label>
            <label>Password: <input type="password" name="password"></label>
            <input type="submit" value="Login">
        </form>
    </article>
</section>`;


export function setupLogin() {
    return showLogin;

    function showLogin() {
        return loginTemplate();
    }
}

export async function onLoginSubmit(data, onSuccess) {
    try {
        await login(data.email, data.password);
        onSuccess();
    } catch (err) {
        alert(err.message);
    }
}