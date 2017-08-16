define([
    'models/words',
    'locale'
], (words, _) => {
    function addRow() {
        // words.arrayOfWords.add({originalWord: 'New word', translationWord: '', partOfSpeech: 0});
        $$('gridDatatable').add({originalWord: 'New word', translationWord: '', partOfSpeech: 0});
    }
    function deleteRow() {
        // words.arrayOfWords.remove($$('gridDatatable').getSelectedId(true));
        $$('gridDatatable').remove($$('gridDatatable').getSelectedId(true));
    }
    function showDataStatus(grid) {
        if (!grid.count()) {
            grid.showOverlay('There\'s no data');
        }
        else {
            grid.hideOverlay();
        }
    }

    // custom proxy for datatable editing in row, and upload ALL changes in 1 call to server
    webix.proxy.restWithDataProcessorDelay = {
        $proxy: true,
        load(view, callback) {
            webix.ajax(this.source, callback, view);
        },
        save(view, update, dp, callback) {
            return webix.delay(() => {
                webix.proxy.restWithDataProcessorDelay._save_logic.call(
                    this, view, update, dp, callback, webix.ajax()
                );
            });
        },

        _save_logic(view, update, dp, callback, ajax) {
            let url = this.source;
            let query = '';
            let mark = url.indexOf('?');

            if (mark !== -1) {
                query = url.substr(mark);
                url = url.substr(0, mark);
            }

            url += url.charAt(url.length - 1) == '/' ? '' : '/';
            let mode = update.operation;


            let data = update.data;
            if (mode === 'insert') delete data.id;

            // call restWithDataProcessorDelay URI
            if (mode === 'update') {
                ajax.put(url + data.id + query, data, callback);
            }
            else if (mode === 'delete') {
                ajax.del(url + data.id + query, data, callback);
            }
            else {
                ajax.post(url + query, data, callback);
            }
        }
    };

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
            {view: 'button', value: _('Add row'), click: addRow},
            {view: 'button', value: _('Delete row'), click: deleteRow},
            {gravity: 2}
        ]
    };

    let grid = {
        id: 'gridDatatable',
        url: 'api/getWords', // simple load data
        save: {
            url: 'restWithDataProcessorDelay->/api/word', // custom proxy
            updateFromResponse: true
        },
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
            },
            onBeforeLoad() {
                this.showOverlay('Loading...');
            },
            onAfterLoad() {
                showDataStatus(this);
            },
            onAfterDelete() {
                showDataStatus(this);
            },
            onAfterAdd() {
                showDataStatus(this);
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
                header: [_('Original word'), {content: 'customTextFilter', placeholder: _('Find word')}],
                sort: 'string',
                footer: {text: _('words in wordgroup'), colspan: 3, css: 'sample_footer'}
            },
            {
                id: 'translationWord',
                fillspace: 4,
                editor: 'text',
                header: [_('Translation'), {content: 'customTextFilter', placeholder: _('Find translation')}],
                sort: 'string'
            },
            {
                id: 'partOfSpeech',
                fillspace: 1,
                editor: 'select',
                header: [_('Part of speech'), {content: 'selectFilter'}],
                collection: [
                    {id: 1, value: _('Verb')},
                    {id: 2, value: _('Noun')},
                    {id: 3, value: _('Adjective')},
                    {id: 4, value: _('Adverb')},
                    {id: 5, value: _('Pronoun')},
                    {id: 6, value: _('Preposition')},
                    {id: 7, value: _('Conjunction')},
                    {id: 8, value: _('Interjection')}
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
                label: _('Test reults'),
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
                    webix.toPNG($$('gridDatatable'), 'my_vocabulary');
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

    let ui = {
        rows: [
            toolbar,
            grid,
            dtFooterToolbar
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


            // $$('gridDatatable').data.sync(words.arrayOfWords);

            // words.arrayOfWords.attachEvent('onBeforeLoad', () => {
            //     $$('gridDatatable').showOverlay('Loading...');
            // });
            // words.arrayOfWords.attachEvent('onAfterLoad', () => {
            //     showDataStatus($$('gridDatatable'));
            // });
            // words.arrayOfWords.attachEvent('onAfterDelete', () => {
            //     showDataStatus($$('gridDatatable'));
            // });
            // words.arrayOfWords.attachEvent('onAfterAdd', () => {
            //     showDataStatus($$('gridDatatable'));
            // });
        }
    };
});
