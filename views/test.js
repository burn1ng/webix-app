define([
    'protected',
    'models/dataForTest',
    'locale'
], (app, dataForTest, _) => {
    let page = {
        rows: [
            {},
            {
                cols: [
                    {},
                    {
                        view: 'form',
                        type: 'space',
                        width: 500,
                        elementsConfig: {
                            padding: 5
                        },
                        elements: [
                            {
                                view: 'template',
                                template: 'Please, provide correct answer',
                                type: 'header'
                            },
                            {
                                template: 'here is the question'
                                // autoheight: true
                            },
                            {
                                cols: [
                                    {
                                        rows: [
                                            {
                                                view: 'button',
                                                id: 'button:first',
                                                value: _('test_results')
                                            },
                                            {
                                                view: 'button',
                                                id: 'button:second',
                                                label: _('test_results')
                                            }
                                        ]
                                    },
                                    {
                                        rows: [
                                            {
                                                view: 'button',
                                                id: 'button:third',
                                                value: _('test_results')
                                            },
                                            {
                                                view: 'button',
                                                id: 'button:fourth',
                                                value: _('test_results')
                                            }
                                        ]
                                    }
                                ]
                            }

                        ]
                    },
                    {}
                ]
            },
            {}
        ]
    };

    return {
        $ui: page,
        $oninit: (view, $scope) => {
            if (!dataForTest.randomData.length) {
                app.show('top/dashboard');
            }
            console.log(dataForTest.randomData);
        }

    };
});
