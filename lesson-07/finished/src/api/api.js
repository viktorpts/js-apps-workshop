export default function createApi(beginRequest, endRequest) {
    const endpoints = {
        REGISTER: 'users/register',
        LOGIN: 'users/login',
        LOGOUT: 'users/logout'
    };

    return {
        beginRequest() {
            if (typeof beginRequest == 'function') {
                beginRequest();
            }
        },

        endRequest() {
            if (typeof endRequest == 'function') {
                endRequest();
            }
        },

        host(endpoint) {
            return `http://localhost:3030/${endpoint}`;
        },

        getOptions(headers) {
            const token = sessionStorage.getItem('userToken');

            const options = { headers: headers || {} };

            if (token !== null) {
                Object.assign(options.headers, { 'X-Authorization': token });
            }

            return options;
        },

        async request(endpoint, options) {
            let response;

            this.beginRequest();
            try {
                response = await fetch(endpoint, options);

                if (response.status == 200) {
                    return await response.json();
                } else {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } catch (err) {
                if (err instanceof SyntaxError) {
                    return response;
                } else if(err.message == 'Invalid access token') {
                    console.log('Invalid session, resetting storage');
                    sessionStorage.clear();
                    window.location.pathname = '/';
                } else {
                    throw err;
                }
            } finally {
                this.endRequest();
            }
        },

        async get(endpoint) {
            return this.request(this.host(endpoint), this.getOptions());
        },

        async post(endpoint, body) {
            const options = this.getOptions({ 'Content-Type': 'application/json' });
            options.method = 'POST';
            options.body = JSON.stringify(body);

            return this.request(this.host(endpoint), options);
        },

        async put(endpoint, body) {
            const options = this.getOptions({ 'Content-Type': 'application/json' });
            options.method = 'PUT';
            options.body = JSON.stringify(body);

            return this.request(this.host(endpoint), options);
        },

        async delete(endpoint) {
            const options = this.getOptions();
            options.method = 'DELETE';

            return this.request(this.host(endpoint), options);
        },

        async register(email, password) {
            const result = await this.post(endpoints.REGISTER, {
                email,
                password
            });

            sessionStorage.setItem('userToken', result['accessToken']);
            sessionStorage.setItem('email', result.email);
            sessionStorage.setItem('userId', result._id);

            return result;
        },

        async login(email, password) {
            const result = await this.post(endpoints.LOGIN, {
                email,
                password
            });

            sessionStorage.setItem('userToken', result['accessToken']);
            sessionStorage.setItem('email', result.email);
            sessionStorage.setItem('userId', result._id);

            return result;
        },

        async logout() {
            const result = await this.get(endpoints.LOGOUT);
            sessionStorage.removeItem('userToken');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('userId');
            return result;
        }
    };
};