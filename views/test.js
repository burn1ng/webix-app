define([
    'protected',
    'models/dataForTest',
    'locale'
], (app, dataForTest, _) => {
    let score = 0;
    let currentDataItem = 0;

    function loadVariants(index, toolbarId) {
        let buttons = $$(toolbarId).elements;
        for (let i = 0; i < 4; i++) {
            buttons[i].setValue(`${dataForTest.steps[index].variants[i] || ''}`);
            buttons[i].refresh();
        }
    }
    function loadQuestion(index, templateId) {
        let template = $$(templateId);
        template.refresh();
        console.log(dataForTest.steps);
        template.config.data.question = `${index + 1}. ${dataForTest.steps[index].question}`;
        template.refresh();
        // template.render();
    }

    function nextQuestion(toolbarId, templateId) {
        loadVariants(currentDataItem, toolbarId);
        loadQuestion(currentDataItem, templateId);
    }

    function onButtonClickHandler(id, toolbarId, templateId) {
        if (currentDataItem >= dataForTest.steps.length - 1) {
            $$(toolbarId).disable();

            webix.message(`Nice! Your score is ${score}! Saving your results...`);

            let promise = webix.ajax().put('/api/updateTest', {
                score,
                _id: dataForTest._id
            });

            promise.then((res) => {
                console.log(res.json());
                // app.show('test');
            }).fail((err) => {
                webix.message({type: 'warning', text: `Sorry, problems with test generating: ${err}`});
            });

            return;
        }

        let clickedButton = $$(id);
        if (clickedButton.data.value === dataForTest.steps[currentDataItem].correctAnswer) {
            if (dataForTest.steps[currentDataItem].questionPartOfSpeech === 1 || 2) {
                score += 2;
                webix.message('Brilliant! +2 points for correct answer!');
            }
            else {
                score += 1;
                webix.message('Correct! +1 point for coorect answer!');
            }
        }
        else {
            webix.message('Ooops... Not Correct!');
        }

        currentDataItem++;
        console.log(currentDataItem);
        if (currentDataItem < dataForTest.steps.length) {
            nextQuestion(toolbarId, templateId);
        }
    }


    let page = {
        rows: [
            {},
            {
                cols: [
                    {},
                    {
                        view: 'form',
                        id: 'test:form',
                        type: 'space',
                        width: 500,
                        elementsConfig: {
                            padding: 5
                        },
                        elements: [
                            {
                                view: 'template',
                                id: 'test:header',
                                template: 'Please, provide correct answer',
                                type: 'header'
                            },
                            {
                                id: 'test:question',
                                data: dataForTest.steps[currentDataItem],
                                template: '<div class="question"><span>#question#</span> ?</div>',
                                autoheight: true
                            },
                            {
                                view: 'toolbar',
                                borderless: true,
                                id: 'test:toolbar',
                                elementsConfig: {
                                    view: 'button',
                                    height: 100,
                                    on: {
                                        onItemClick(id) {
                                            onButtonClickHandler(
                                                id,
                                                this.getParentView().config.id,
                                                'test:question',
                                            );
                                        }
                                    }
                                },
                                elements: [
                                    {
                                        id: 'button:first',
                                        name: '0'
                                    },
                                    {
                                        id: 'button:second',
                                        name: '1'
                                    },
                                    {
                                        id: 'button:third',
                                        name: '2'
                                    },
                                    {
                                        id: 'button:fourth',
                                        name: '3'
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
            if (!dataForTest.steps.length) {
                app.show('top/dashboard');
            }

            loadVariants(currentDataItem, 'test:toolbar');
            loadQuestion(currentDataItem, 'test:question');
        },
        $ondestroy() {
            dataForTest.steps = [];
            dataForTest._id = 0;
            console.dir(`ondestroy: ${dataForTest.steps}`);
        }

    };
});
