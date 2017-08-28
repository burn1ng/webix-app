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
                                css: 'template_question',
                                name: 'question',
                                template: '<div><span class="index"></span> <span style="question">#question#</span> ?</div>'
                            },
                            {
                                cols: [
                                    {
                                        view: 'form',
                                        borderless: true,
                                        id: 'test:buttons',
                                        elementsConfig: {
                                            view: 'button',
                                            width: 200
                                        },
                                        elements: [
                                            {
                                                id: 'button:first',
                                                name: '0'
                                            },
                                            {
                                                id: 'button:third',
                                                name: '1'
                                            },
                                            {
                                                id: 'button:second',
                                                name: '2'
                                            },
                                            {
                                                id: 'button:fourth',
                                                name: '3'
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
            // if (!dataForTest.data.length) {
            //     app.show('top/dashboard');
            // }
            let mydata = [
                {question: 'and', correctAnswer: 'и', variants: ['или', 'и']},
                {question: 'bird', correctAnswer: 'птица', variants: ['птица', 'собака', 'тигр', 'слон']},
                {question: 'struggle', correctAnswer: 'сражаться', variants: ['плыть', 'лететь', 'бежать', 'сражаться']},
                {question: 'run', correctAnswer: 'бежать', variants: ['лететь', 'сражаться', 'бежать', 'лаять']},
                {question: 'swim', correctAnswer: 'плыть', variants: ['бежать', 'лететь', 'сражаться', 'плыть']},
                {question: 'bark', correctAnswer: 'лаять', variants: ['плыть', 'бежать', 'лететь', 'лаять']},
                {question: 'elephant', correctAnswer: 'слон', variants: ['собака', 'слон', 'курица', 'тигр']},
                {question: 'tiger', correctAnswer: 'тигр', variants: ['собака', 'тигр', 'курица', 'слон']},
                {question: 'or', correctAnswer: 'или', variants: ['и', 'или']},
                {question: 'fly', correctAnswer: 'лететь', variants: ['сражаться', 'лететь', 'лаять', 'плыть']}
            ];

            function loadVariants(index) {
                let buttons = $$('test:buttons').elements;
                for (let i = 0; i < Object.keys(buttons).length; i++) {
                    buttons[i].setValue(mydata[index].variants[i]);
                    buttons[i].refresh();
                }
            }

            function loadQuestion(index) {
                let form = $$('test:form');
                form.data = mydata[index];

                $$('test:form').refresh();

                console.log(form);
            }

            let currentItem = 0;
            loadVariants(currentItem);
            loadQuestion(currentItem);

            // $$('test:buttons').setValues({
            //     value0: mydata[0].variants[0],
            //     value1: mydata[0].variants[1],
            //     value2: mydata[0].variants[2],
            //     value3: mydata[0].variants[3]
            // });


            // console.log($$('test:form').getValues());


            // $$('button:first').setValue(mydata[0].variants[0]);
            // $$('button:second').setValue(mydata[0].variants[1]);
            // $$('button:third').setValue(mydata[0].variants[2]);
            // $$('button:fourth').setValue(mydata[0].variants[3]);


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
