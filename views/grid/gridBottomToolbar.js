define([
    'protected',
    'locale',
    'models/dataForTest'
], (app, _, dataForTest) => {
    let gridBottomToolbar = {
        id: 'gridBottomToolbar',
        view: 'toolbar',
        height: 46,
        elements: [
            {
                view: 'button',
                id: 'gridBottomToolbar:testResults',
                type: 'iconButton',
                icon: 'trophy',
                label: _('test_results'),
                autowidth: true,
                click() {
                    // TODO
                }
            },
            {},
            {
                view: 'icon',
                icon: 'file-image-o',
                tooltip: _('png_export'),
                width: 66,
                click() {
                    webix.toPNG($$('gridDatatable'), 'my_vocabulary');
                }
            },
            {
                view: 'icon',
                icon: 'file-pdf-o',
                tooltip: _('pdf_export'),
                width: 66,
                click() {
                    webix.toPDF($$('gridDatatable'), {
                        filename: 'myVocabulary'
                    });
                }
            },
            {
                view: 'icon',
                icon: 'file-excel-o',
                tooltip: _('excel_export'),
                width: 66,
                click() {
                    webix.toExcel($$('gridDatatable'), {
                        filename: 'myVocabulary',
                        name: 'English words',
                        filterHTML: true,
                        columns: {
                            index: {header: '#'},
                            originalWord: {header: _('orig_word'), width: 350},
                            translationWord: {header: _('translation'), width: 400},
                            partOfSpeech: {header: _('part_of_speech'), width: 200}
                        }
                    });
                }
            },
            {},
            {
                view: 'button',
                id: 'en_rus_test',
                type: 'iconButton',
                icon: 'cog',
                label: 'Test English words!', // _('test_generate'),
                autowidth: true
            },
            {
                view: 'button',
                id: 'rus_en_test',
                type: 'iconButton',
                icon: 'cog',
                label: 'Test Russian words!', // _('test_generate'),
                autowidth: true
            }
        ]
    };

    return {
        $ui: gridBottomToolbar,
        $oninit: (view, $scope) => {
            webix.extend($$('gridDatatable'), webix.ProgressBar);

            let done;

            function generateTestHandler(id) {
                // $$(id).attachEvent('onItemClick', () => {
                let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
                if (selectedWordGroup) {
                    let currentCount = selectedWordGroup.count;

                    if (!currentCount) {
                        webix.message({type: 'warning', text: 'Please, add words in your wordgroup before test generating!'});
                        return;
                    }

                    // prevent several clicks
                    (() => {
                        if (!done) {
                            done = true;

                            $$('gridDatatable').showProgress({type: 'icon', delay: 3000});
                            webix.message({text: `Test for ${selectedWordGroup.wordGroupName} is genearting now...`});

                            let promise = webix.ajax().post('/api/generateTest', {
                                wordGroupId: selectedWordGroup._id,
                                count: currentCount,
                                typeOfTest: id === 'en_rus_test' ? 0 : 1 // 0 - eng to rus test, 1 - rus to eng test
                            });

                            promise.then((response) => {
                                // console.log(response.json());
                                response = response.json();
                                dataForTest.steps = response.steps;
                                dataForTest._id = response._id;
                                app.show('test');
                            }).fail((err) => {
                                webix.message({type: 'warning', text: `Sorry, problems with test generating: ${err}`});
                            });
                        }
                    })();
                }
                else {
                    webix.message({type: 'warning', text: 'Please, at first select any wordgroup for testing!'});
                }
                // });
            }

            $$('en_rus_test').attachEvent('onItemClick', (id) => { generateTestHandler(id); });
            $$('rus_en_test').attachEvent('onItemClick', (id) => { generateTestHandler(id); });
        }
    };
});
