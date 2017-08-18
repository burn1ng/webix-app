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
                    maxWidth: 400,
                    id: 'signupForm',
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
                            template: 'Please, sign up'
                        },
                        {
                            view: 'fieldset',
                            label: 'Fill all fields to signup',
                            body: {
                                rows: [
                                    {
                                        view: 'text',
                                        required: true,
                                        maxlength: 90,
                                        name: 'displayName',
                                        label: 'Name',
                                        placeholder: 'Your name',
                                        validate: webix.rules.isNotEmpty,
                                        invalidMessage: ' Please, write your name here'
                                    },
                                    {
                                        view: 'text',
                                        type: 'email',
                                        required: true,
                                        maxlength: 75,
                                        name: 'email',
                                        label: 'Email',
                                        placeholder: 'E-mail',
                                        validate: webix.rules.isEmail,
                                        invalidMessage: ' Please, provide correct e-mail'
                                    },
                                    {
                                        view: 'text',
                                        type: 'password',
                                        required: true,
                                        maxlength: 50,
                                        name: 'password',
                                        label: 'Password',
                                        placeholder: 'Password',
                                        validate: webix.rules.isNotEmpty,
                                        invalidMessage: ' Sorry, but password can\'t be empty'
                                    }
                                ]
                            }},
                        {
                            margin: 5,
                            cols: [
                                {
                                    view: 'button',
                                    id: 'signupButton',
                                    value: 'Sign up!',
                                    type: 'form',
                                    click() {
                                        if ($$('signupForm').validate()) {
                                            $$('signupForm').callEvent('onSubmit');
                                        }
                                    }
                                },
                                {
                                    view: 'button',
                                    value: 'Cancel',
                                    click() {
                                        $$('signupForm').clearValidation();
                                    }
                                }
                            ]
                        },
                        {
                            view: 'label',
                            template: "<a href='#!/login'>Have an account? Login here</a>",
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
            const signupForm = $$('signupForm');
            signupForm.attachEvent('onSubmit', () => {
                let createUserPromise = webix.ajax().post('/api/user', $$('signupForm').getValues());

                createUserPromise.then((response) => {
                    let displayName = response.json().displayName;

                    webix.message(
                        `Hey, ${displayName}! \n
                        Your profile successfull created.`
                    );
                    setTimeout(() => {
                        app.show('/login');
                        webix.message(
                            `Please, login with your credentials \n
                            and enjoy English App!`
                        );
                    }, 2500);
                }).fail((err) => {
                    if (err.status === 500) {
                        webix.message(
                            `Wooops. Application is unavailable now. Please, try again later. \n
                            Error: ${err.response}`
                        );
                    }
                    else {
                        console.log(err);
                        webix.message(
                            `You email is already registered. \n
                            Error: ${err.response}`
                        );
                    }
                });
            });
        }
    };
});
