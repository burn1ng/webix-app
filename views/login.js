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
                    maxWidth: 400,
                    id: 'loginForm',
                    elementsConfig: {
                        labelAlign: 'right',
                        labelWidth: 90,
                        bottomPadding: 18,
                        on: {
                            onChange() {
                                this.validate();
                            }
                        }
                    },
                    elements: [
                        {
                            type: 'header',
                            template: 'Please, sign in'
                        },
                        {
                            view: 'fieldset',
                            label: 'Credentials',
                            body: {
                                rows: [
                                    {
                                        view: 'text',
                                        type: 'email',
                                        name: 'email',
                                        label: 'Email',
                                        placeholder: 'Your e-mail',
                                        validate: webix.rules.isEmail,
                                        invalidMessage: ' Please, provide correct e-mail'
                                    },
                                    {
                                        view: 'text',
                                        type: 'password',
                                        name: 'password',
                                        label: 'Password',
                                        placeholder: 'Your password',
                                        invalidMessage: ' Sorry, but password can\'t be empty'
                                    }
                                ]
                            }},
                        {
                            margin: 5,
                            cols: [
                                {
                                    view: 'button',
                                    id: 'loginButton',
                                    value: 'Login',
                                    type: 'form',
                                    click() {
                                        if ($$('loginForm').validate()) {
                                            $$('loginForm').callEvent('onSubmit');
                                        }
                                    }
                                },
                                {
                                    view: 'button',
                                    value: 'Cancel',
                                    click() {
                                        $$('loginForm').clearValidation();
                                    }
                                }
                            ]
                        },
                        {
                            view: 'label',
                            template: "<a href='#!/signup'>Need an account? Sign up here</a>",
                            align: 'center'
                        }
                    ]
                },
                {}
            ]},
            {}
        ]
    };


    return {
        $ui: ui,
        $oninit: () => {
            const loginForm = $$('loginForm');

            loginForm.attachEvent('onSubmit', () => {
                let getTokenPromise = webix.ajax().post('/api/login', $$('loginForm').getValues());

                getTokenPromise.then((response) => {
                    let data = response.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.user);

                    // inner promise uses setted token from localstorage, cannot be done without it
                    let loginPromise = webix.ajax().headers({
                        Authorization: localStorage.getItem('token')
                    }).post('/dashboard');
                    loginPromise.then(() => {
                        window.location.href = '/protected.html';
                    });
                    loginPromise.fail((err) => {
                        if (err.status === 500) {
                            webix.message(`Wooops. Application is unavailable now. Please, try later. Error: ${err.response}`);
                        }
                        else {
                            // if token which is just setted is wrong, looks like a hack attack! =)
                            localStorage.removeItem('token');
                            localStorage.removeItem('userName');
                            webix.message(`Something went wrong. Error: ${err.response} Please, login again`);
                        }
                    });
                });
                getTokenPromise.fail((err) => {
                    if (err.status === 401) {
                        webix.message(`Wooops. Your login/password are incorrect. Error: ${err.response} Please, login again`);
                    }
                    else if (err.status === 500) {
                        webix.message(`Wooops. Application is unavailable now. Please, try later. Error: ${err.response}`);
                    }
                });
            });
        }
    };
});
