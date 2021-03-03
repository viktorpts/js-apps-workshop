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


export function setupRegister() {
    return showRegister;

    function showRegister() {
        return registerTemplate();
    }
}

export async function onRegisterSubmit(data, onSuccess) {
    if (data.password != data.rePass) {
        return alert('Passwords don\'t match');
    }

    try {
        await regster(data.email, data.password);
        onSuccess();
    } catch (err) {
        alert(err.message);
    }
}