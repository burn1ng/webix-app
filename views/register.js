define([
    'public'
], (app) => {
    let ui = {
        rows: [
            {template: 'Sign up to English App!', type: 'header'},
            {},
            {cols: [
                {},
                {
                    view: 'form',
                    maxWidth: 300,
                    id: 'signUpForm',
                    elementsConfig: {
                        on: {
                            onChange(newv, oldv) {
                                this.validate();
                            }
                        }
                    },
                    elements: [
                        {view: 'fieldset',
                            label: 'Please, fill all fields to register',
                            body: {
                                rows: [
                                    {view: 'text', label: 'Name', name: 'userName', validate: webix.rules.isNotEmpty, placeholder: 'Your name'},
                                    {view: 'text', label: 'Email', name: 'email', validate: webix.rules.isEmail, placeholder: 'E-mail'},
                                    {view: 'text', type: 'password', label: 'Password', name: 'password', validate: webix.rules.isNotEmpty, placeholder: 'Password'}
                                ]
                            }},
                        {
                            margin: 5,
                            cols: [
                                {view: 'button', value: 'Sign up!', type: 'form', id: 'loginButton'},
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
            const signUpForm = $$('signUpForm');
            signUpForm.elements.email.attachEvent('onChange', (newv, oldv) => {
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
