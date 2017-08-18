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
                        bottomPadding: 18
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
                                        invalidMessage: '* Please, provide correct e-mail',
                                        on: {
                                            onChange() {
                                                this.validate();
                                            }
                                        }
                                    },
                                    {
                                        view: 'text',
                                        type: 'password',
                                        name: 'password',
                                        label: 'Password',
                                        placeholder: 'Your password',
                                        minlength: '8',
                                        invalidMessage: 'Sorry, but password can\'t be empty',
                                        on: {
                                            onKeyPress() {
                                                this.validate();
                                            }
                                        }
                                    }
                                ]
                            }},
                        {
                            margin: 5,
                            cols: [
                                {view: 'button', icon: 'sign-in', label: 'Login', type: 'iconButton', id: 'loginButton'},
                                {view: 'button', value: 'Cancel'}
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
            loginForm.elements.email.attachEvent('onChange', (newv, oldv) => {
                webix.message(`Value changed from: ${oldv} to: ${newv}`);
            });

            loginForm.attachEvent('onSubmit', () => {
                webix.ajax().post('/api/login', $$('log_form').getValues(), {
                    error(text, data, xhr) {
                        if (xhr.status === 401) {
                            webix.message(`Wooops. Your login/password are incorrect. ${xhr.response}`);
                        }
                        else if (xhr.status === 500) {
                            webix.message(`Wooops. Application is unavailable now. Please, try later. \n Error: ${xhr.response}`);
                        }
                        // setTimeout(() => {
                        //     window.location.href = '/public.html';
                        // }, 4000);
                    },
                    success(text, data, xhr) {
                        console.log('login - OK');
                        if (xhr.status === 200) {
                            let receivedToken = JSON.parse(xhr.response).token;
                            let receivedName = JSON.parse(xhr.response).user;

                            localStorage.setItem('token', receivedToken);
                            localStorage.setItem('userName', receivedName);

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
