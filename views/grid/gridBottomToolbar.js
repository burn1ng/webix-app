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
                id: 'gridBottomToolbar:testGenerate',
                type: 'iconButton',
                icon: 'cog',
                label: _('test_generate'),
                autowidth: true
            }
        ]
    };

    return {
        $ui: gridBottomToolbar,
        $oninit: (view, $scope) => {
            webix.extend($$('gridDatatable'), webix.ProgressBar);

            $$('gridBottomToolbar:testGenerate').attachEvent('onItemClick', () => {
                let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
                if (selectedWordGroup) {
                    let currentCount = selectedWordGroup.count;

                    if (!currentCount) {
                        webix.message({type: 'warning', text: 'Please, add words in your wordgroup before test generating!'});
                    }

                    $$('gridDatatable').showProgress({type: 'icon', delay: 3000});
                    webix.message({text: `Test for ${selectedWordGroup.wordGroupName} is genearting now...`});

                    let promise = webix.ajax().post('/api/generateTest', {
                        wordGroupId: selectedWordGroup._id,
                        count: currentCount
                    });

                    promise.then((randomWords) => {
                        console.log(randomWords.json());
                        dataForTest.randomData = randomWords.json();
                        app.show('test');
                    }).fail((err) => {
                        webix.message({type: 'warning', text: `Sorry, problems with test generating: ${err}`});
                    });
                }
                else {
                    webix.message({type: 'warning', text: 'Please, at first select any wordgroup for testing!'});
                }
            });
        }
    };
});
