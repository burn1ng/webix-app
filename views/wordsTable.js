define([
    'models/words'
], (words) => {
    function addRow() {
        words.arrayOfWords.add({originalWord: 'New word', translationWord: '', partOfSpeech: 0});
    }
    function deleteRow() {
        words.arrayOfWords.remove($$('gridDatatable').getSelectedId(true));
    }

    function showDataStatus(grid) {
        if (!grid.count()) {
            grid.showOverlay('There\'s no data');
        }
        else {
            grid.hideOverlay();
        }
    }

    // custom summColumn logic for footer's total of rows
    webix.ui.datafilter.customSummColumn = webix.extend({
        refresh(master, node) {
            node.firstChild.innerHTML = master.count();
        }
    }, webix.ui.datafilter.summColumn);

    // custom textFilter logic for render icon in the right corner of input
    webix.ui.datafilter.customTextFilter = webix.extend({
        render(master, config) {
            if (this.init) this.init(config);
            config.css = 'webix_ss_filter';
            // render input and icon
            return `<input ${config.placeholder ?
                `placeholder="${config.placeholder}" ` : ''}type='text'>` +
            ' type=\'text\'><span class=\'webix_icon fa-search\'></span></input>';
        }
    }, webix.ui.datafilter.textFilter);

    let toolbar = {
        id: 'toolbarForDatatable',
        view: 'toolbar',
        elements: [
            {view: 'button', value: 'Add row', click: addRow},
            {view: 'button', value: 'Delete row', click: deleteRow},
            {gravity: 2}
        ]
    };

    let grid = {
        id: 'gridDatatable',
        // url: 'api/getWords', // simple load data
        // save: {
        //     url: 'restWithDataProcessorDelay->/api/word', // custom proxy
        //     updateFromResponse: true
        // },
        view: 'datatable',
        editable: true,
        resizeColumn: true,
        resizeRow: true,
        select: 'row',
        scroll: 'y',
        multiselect: true,
        editaction: 'custom',
        footer: true,
        on: {
            onItemDblClick(id) {
                this.editRow(id);
            },
            'data->onStoreUpdated': function () {
                this.data.each((obj, i) => {
                    obj.index = i + 1;
                });
            }
        },
        columns: [
            {
                id: 'index',
                header: '№',
                adjust: true,
                footer: {content: 'customSummColumn', css: 'sample_footer'}
            },
            {
                id: 'originalWord',
                fillspace: 2,
                editor: 'text',
                header: ['Original word', {content: 'customTextFilter', placeholder: 'Find word'}],
                sort: 'string',
                footer: {text: 'words in wordgroup', colspan: 3, css: 'sample_footer'}
            },
            {
                id: 'translationWord',
                fillspace: 4,
                editor: 'text',
                header: ['Translation', {content: 'customTextFilter', placeholder: 'Find translation'}],
                sort: 'string'
            },
            {
                id: 'partOfSpeech',
                fillspace: 1,
                editor: 'select',
                header: ['Part of speech', {content: 'selectFilter'}],
                collection: [
                    {id: 1, value: 'Verb'},
                    {id: 2, value: 'Noun'},
                    {id: 3, value: 'Adjective'},
                    {id: 4, value: 'Adverb'},
                    {id: 5, value: 'Pronoun'},
                    {id: 6, value: 'Preposition'},
                    {id: 7, value: 'Conjunction'},
                    {id: 8, value: 'Interjection'}
                ],
                sort: 'string'
            }
        ]
    };

    let dtFooterToolbar = {
        id: 'exportToolbar',
        view: 'toolbar',
        elements: [
            {
                view: 'button',
                type: 'iconButton',
                icon: 'file-image-o',
                label: 'Export to Png',
                adjust: true,
                click() {
                    // TODO
                }
            },
            {},
            {
                view: 'icon',
                tooltip: 'Export to Png',
                icon: 'file-image-o',
                click() {
                    webix.toPNG($$('gridDatatable'), {
                        filename: 'myVocabulary'
                    });
                }
            },
            {
                view: 'icon',
                tooltip: 'Export to Pdf',
                icon: 'file-pdf-o',
                click() {
                    webix.toPDF($$('gridDatatable'), {
                        filename: 'myVocabulary'
                    });
                }
            },
            {
                view: 'icon',
                tooltip: 'Export to Excel',
                icon: 'file-excel-o',
                label: 'Export to Excel',
                click() {
                    webix.toExcel($$('gridDatatable'), {
                        filename: 'myVocabulary',
                        name: 'English words'
                    });
                }
            },
            {},
            {
                view: 'button',
                type: 'iconButton',
                icon: 'cog',
                label: 'Generate test!',
                click() {
                    // TODO
                }
            }
        ]
    };

    let testForm = {
        view: 'form',
        elements: [
            {view: 'text', label: 'Group Name', placeholder: 'New group'},
            {cols: [
                {view: 'button', value: 'Login', type: 'form'}
            ]}
        ]
    };

    let ui = {
        rows: [
            toolbar,
            grid,
            dtFooterToolbar,
            testForm
        ]
    };

    return {
        $ui: ui,
        $oninit: (view, $scope) => {
            // let popup = $scope.ui({
            //     view: 'popup',
            //     position: 'center',
            //     body: 'New word added to your vocabulary and saved.'
            // });
            // $scope.on(words.arrayOfWords, 'onDataUpdate', () => {
            //     popup.show();
            // });


            $$('gridDatatable').data.sync(words.arrayOfWords);
            words.arrayOfWords.attachEvent('onBeforeLoad', () => {
                $$('gridDatatable').showOverlay('Loading...');
            });
            words.arrayOfWords.attachEvent('onAfterLoad', () => {
                showDataStatus($$('gridDatatable'));
            });
            words.arrayOfWords.attachEvent('onAfterDelete', () => {
                showDataStatus($$('gridDatatable'));
            });
            words.arrayOfWords.attachEvent('onAfterAdd', () => {
                showDataStatus($$('gridDatatable'));
            });
        }
    };
});
