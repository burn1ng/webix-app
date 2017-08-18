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
                    width: 350,
                    id: 'log_form',
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
                                        invalidMessage: '* Please, provide correct e-mail'
                                    },
                                    {
                                        view: 'text',
                                        type: 'password',
                                        required: true,
                                        name: 'password',
                                        label: 'Password',
                                        placeholder: 'Your password',
                                        invalidMessage: 'Sorry, but password can\'t be empty'
                                    }
                                ]
                            }},
                        {
                            margin: 5,
                            cols: [
                                {view: 'button',
                                    id: 'loginButton',
                                    value: 'Login',
                                    type: 'form',
                                    click() {
                                        if ($$('log_form').validate()) {
                                            $$('log_form').callEvent('onSubmit');
                                        }
                                    }
                                },
                                {
                                    view: 'button',
                                    value: 'Cancel',
                                    click() {
                                        $$('log_form').clearValidation();
                                    }
                                }
                            ]
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
            const loginForm = $$('log_form');

            loginForm.attachEvent('onSubmit', () => {
                let getTokenPromise = webix.ajax().post('/api/login', $$('log_form').getValues());
                let loginPromise = webix.ajax().post('/dashboard');

                getTokenPromise.then((response) => {
                    let data = response.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.user);

                    loginPromise.then(() => {
                        window.location.href = '/protected.html';
                    });
                }).fail((err) => {
                    if (err.status === 401) {
                        webix.message(`Wooops. Your login/password are incorrect. ${err.response}`);
                        webix.message('Please, login again');
                    }
                    else if (err.status === 500) {
                        webix.message(`Wooops. Application is unavailable now. Please, try later. \n Error: ${err.response}`);
                    }
                });
            });
        }
    };
});
