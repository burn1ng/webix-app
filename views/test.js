define([
    'protected',
    'models/dataForTest',
    'locale'
], (app, dataForTest, _) => {
    let mydata = [
        {question: 'bird', questionPartOfSpeech: 2, correctAnswer: 'птица', variants: ['расследование', 'птица', 'слон', 'курица']},
        {question: 'slowly ', questionPartOfSpeech: 4, correctAnswer: 'медленно', variants: ['скоро', 'легко', 'медленно', 'еженедельно']},
        {question: 'fly', questionPartOfSpeech: 1, correctAnswer: 'лететь', variants: ['лаять', 'бежать', 'лететь', 'плыть']},
        {question: 'hardly', questionPartOfSpeech: 4, correctAnswer: 'тяжело', variants: ['полностью', 'тяжело', 'медленно', 'теперь, сейчас']},
        {question: 'or', questionPartOfSpeech: 7, correctAnswer: 'или', variants: ['или', 'и']},
        {question: 'elephant', questionPartOfSpeech: 2, correctAnswer: 'слон', variants: ['расследование', 'курица', 'тигр', 'слон']},
        {question: 'easily', questionPartOfSpeech: 4, correctAnswer: 'легко', variants: ['скоро', 'медленно', 'легко', 'теперь, сейчас']},
        {question: 'weekly', questionPartOfSpeech: 4, correctAnswer: 'еженедельно', variants: ['еженедельно', 'теперь, сейчас', 'скоро', 'медленно']},
        {question: 'bark', questionPartOfSpeech: 1, correctAnswer: 'лаять', variants: ['бежать', 'лететь', 'сражаться', 'лаять']},
        {question: 'tiger', questionPartOfSpeech: 2, correctAnswer: 'тигр', variants: ['собака', 'курица', 'тигр', 'птица']}
    ];

    let score = 0;
    let currentDataItem = 0;

    function loadVariants(index, toolbarId) {
        let buttons = $$(toolbarId).elements;
        for (let i = 0; i < Object.keys(buttons).length; i++) {
            buttons[i].setValue(`${mydata[index].variants[i] || ''}`);
            buttons[i].refresh();
        }
    }
    function loadQuestion(index, templateId) {
        let template = $$(templateId);
        template.refresh();
        template.config.data.question = `${index + 1}. ${mydata[index].question}`;
        template.refresh();
        // template.render();
    }

    function onButtonClickHandler(id, toolbarId, templateId) {
        let clickedButton = $$(id);
        if (clickedButton.data.value === mydata[currentDataItem].correctAnswer) {
            if (mydata[currentDataItem].questionPartOfSpeech === 1 || 2) {
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
        loadVariants(currentDataItem, toolbarId);
        loadQuestion(currentDataItem, templateId);
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
                                data: mydata[currentDataItem],
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
            // if (!dataForTest.data.length) {
            //     app.show('top/dashboard');
            // }


            loadVariants(currentDataItem, 'test:toolbar');
            loadQuestion(currentDataItem, 'test:question');


            // mydata.forEach((item, i, arr) => {
            //     let testItem = item;
            //     let question = item.question;
            // });
        },
        $ondestroy() {
            dataForTest.data = [];
            console.dir(`ondestroy: ${dataForTest.data}`);
        }

    };
});
