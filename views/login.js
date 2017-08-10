define([
    'public'
], (app) => {
    let ui = {
        rows: [
            {template: 'Welcome to English App!', type: 'header'},
            {},
            {cols: [
                {},
                {
                    view: 'form',
                    maxWidth: 300,
                    id: 'log_form',
                    elements: [
                        {view: 'fieldset',
                            label: 'Please, sign in',
                            body: {
                                rows: [
                                    {view: 'text', label: 'Email', name: 'email', placeholder: 'E-mail'},
                                    {view: 'text', type: 'password', label: 'Password', name: 'password', placeholder: 'Password'}
                                ]
                            }},
                        {
                            margin: 5,
                            cols: [
                                {view: 'button', value: 'Login', type: 'form', id: 'loginButton'},
                                {view: 'button', value: 'Cancel'}
                            ]
                        }
                    ],
                    rules: {
                        email: webix.rules.isEmail,
                        login: webix.rules.isNotEmpty
                    }
                },
                {}
            ]},
            {}
        ]
    };


    return {
        $ui: ui,
        $oninit: () => {
            const loginForm = $$('log_form');
            loginForm.elements.email.attachEvent('onChange', (newv, oldv) => {
                webix.message(`Value changed from: ${oldv} to: ${newv}`);
            });

            loginForm.attachEvent('onSubmit', () => {
                webix.ajax().post('/api/login', $$('log_form').getValues(), {
                    error(text, data, xhr) {
                        webix.message(`Wooops. Looks like a error: ${xhr.response}`);
                        console.log('wrong username/password');
                        setTimeout(() => {
                            window.location.href = '/public.html';
                        }, 4000);
                    },
                    success(text, data, xhr) {
                        console.log('login - OK');
                        if (xhr.status === 200) {
                            console.log(xhr);
                            let receivedToken = JSON.parse(xhr.response).token;
                            localStorage.setItem('token', receivedToken);

                            webix.ajax().headers({
                                Authorization: receivedToken
                            }).post('/dashboard', (text2, data2, xhr2) => {
                                console.log(xhr2);
                                if (xhr2.status === 200) {
                                    window.location.href = '/protected.html';
                                }
                            });
                        }
                    }
                });
            });
        }
    };
});
