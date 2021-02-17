let section;

export function setupLogin(targetSection, onLogin) {
    section = targetSection;
    const form = targetSection.querySelector('form');

    form.addEventListener('submit', (ev => {
        ev.preventDefault();
        new FormData(ev.target);
    }));
    
    form.addEventListener('formdata', (ev => {
        onSubmit([...ev.formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
    }));
    
    async function onSubmit(data) {
        const body = JSON.stringify({
            email: data.email,
            password: data.password,
        });
    
        try {
            const response = await fetch('http://localhost:3030/users/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });
            const data = await response.json();
            if (response.status == 200) {
                sessionStorage.setItem('authToken', data.accessToken);
                sessionStorage.setItem('userId', data._id);
                onLogin();
            } else {
                alert(data.message);
                throw new Error(data.message);
            }
        } catch (err) {
            console.error(err.message);
        }
    }
}