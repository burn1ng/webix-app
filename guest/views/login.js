define([
    'app'
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
                webix.ajax().post('/login', $$('log_form').getValues(), {
                    error(text, data, xhr) {
                        webix.message(`Wooops. Looks like a error: ${xhr.response}`);
                    },
                    success(text, data, xhr) {
                        let receivedToken = JSON.parse(xhr.response).token;
                        let localToken = localStorage.getItem('token');

                        if (!localToken) {
                            localStorage.setItem('token', receivedToken);
                        }

                        app.show('/top/wordsTable');
                        console.log(xhr);
                    }
                });
            });
        }
    };
});
