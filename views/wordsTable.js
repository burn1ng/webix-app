define([
    'models/words',
    'locale'
], (words, _) => {
    function addRow(grid) {
        grid.add({originalWord: 'New word', translationWord: '', partOfSpeech: 0});
    }
    function deleteRow(grid) {
        grid.remove(grid.getSelectedId(true));
    }
    function deleteAllRows(grid) {
        let allRows = [];
        grid.eachRow(
            (row) => {
                allRows.push(grid.getItem(row).id);
            }
        );
        grid.remove(allRows);
    }
    function showDataStatus(grid) {
        if (!grid.count()) {
            grid.showOverlay(_('empty_data'));
        }
        else {
            grid.hideOverlay();
        }
    }

    // let data = [{originalWord: 'Hawk-eagle, crowned', translationWord: 'Gigashots', partOfSpeech: 3},
    //     {originalWord: 'Kangaroo, red', translationWord: 'Yakidoo', partOfSpeech: 1},
    //     {originalWord: "Verreaux's sifaka", translationWord: 'Realfire', partOfSpeech: 5},
    //     {originalWord: 'White rhinoceros', translationWord: 'Jetpulse', partOfSpeech: 4},
    //     {originalWord: 'Badger, honey', translationWord: 'Quire', partOfSpeech: 7},
    //     {originalWord: 'Cardinal, black-throated', translationWord: 'Browsedrive', partOfSpeech: 2},
    //     {originalWord: 'Aardwolf', translationWord: 'Twitternation', partOfSpeech: 1},
    //     {originalWord: 'Partridge, coqui', translationWord: 'Rhybox', partOfSpeech: 3},
    //     {originalWord: 'Red-necked wallaby', translationWord: 'Jaxnation', partOfSpeech: 8},
    //     {originalWord: 'Kite, black', translationWord: 'Tagchat', partOfSpeech: 6},
    //     {originalWord: 'Pygmy possum', translationWord: 'Ozu', partOfSpeech: 8},
    //     {originalWord: 'Mynah, indian', translationWord: 'Lazzy', partOfSpeech: 2},
    //     {originalWord: 'Owl, great horned', translationWord: 'Edgeblab', partOfSpeech: 6},
    //     {originalWord: 'Coqui partridge', translationWord: 'Kamba', partOfSpeech: 3},
    //     {originalWord: 'Glossy ibis', translationWord: 'Kaymbo', partOfSpeech: 5},
    //     {originalWord: 'Weaver, white-browed sparrow', translationWord: 'Omba', partOfSpeech: 7},
    //     {originalWord: 'Sandhill crane', translationWord: 'Wikizz', partOfSpeech: 1},
    //     {originalWord: 'Common turkey', translationWord: 'Buzzshare', partOfSpeech: 1},
    //     {originalWord: 'Leopard', translationWord: 'Browsezoom', partOfSpeech: 2},
    //     {originalWord: 'Baboon, yellow', translationWord: 'Skinte', partOfSpeech: 8},
    //     {originalWord: 'Waxbill, black-cheeked', translationWord: 'Mudo', partOfSpeech: 4},
    //     {originalWord: 'King vulture', translationWord: 'Camimbo', partOfSpeech: 3},
    //     {originalWord: 'Antelope, sable', translationWord: 'Dabshots', partOfSpeech: 4},
    //     {originalWord: 'Grey fox', translationWord: 'Meejo', partOfSpeech: 5},
    //     {originalWord: 'Marmot, yellow-bellied', translationWord: 'Zoombeat', partOfSpeech: 1}];

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
        height: 66,
        elements: [
            {view: 'button',
                autowidth: true,
                type: 'iconButtonTop',
                icon: 'calendar-plus-o',
                label: _('add_row'),
                click() {
                    addRow($$('gridDatatable'));
                }},
            {view: 'button',
                autowidth: true,
                type: 'iconButtonTop',
                icon: 'calendar-minus-o',
                label: _('del_row'),
                click() {
                    deleteRow($$('gridDatatable'));
                }},
            {gravity: 1},
            {view: 'button',
                autowidth: true,
                type: 'iconButtonTop',
                icon: 'calendar-times-o',
                label: _('del_all_rows'),
                click() {
                    deleteAllRows($$('gridDatatable'));
                }}
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
                this.showOverlay(_('load_message'));
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
                header: [_('orig_word'), {content: 'customTextFilter', placeholder: _('find_word')}],
                sort: 'string',
                footer: {text: _('words_amount'), colspan: 3, css: 'sample_footer'}
            },
            {
                id: 'translationWord',
                fillspace: 4,
                editor: 'text',
                header: [_('translation'), {content: 'customTextFilter', placeholder: _('find_translation')}],
                sort: 'string'
            },
            {
                id: 'partOfSpeech',
                fillspace: 1,
                editor: 'select',
                header: [_('part_of_speech'), {content: 'selectFilter'}],
                collection: [
                    {id: 1, value: _('verb')},
                    {id: 2, value: _('noun')},
                    {id: 3, value: _('adjective')},
                    {id: 4, value: _('adverb')},
                    {id: 5, value: _('pronoun')},
                    {id: 6, value: _('preposition')},
                    {id: 7, value: _('conjunction')},
                    {id: 8, value: _('interjection')}
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
                label: _('test_results'),
                adjust: true,
                click() {
                    // TODO
                }
            },
            {},
            {
                view: 'icon',
                tooltip: _('png_export'),
                icon: 'file-image-o',
                click() {
                    webix.toPNG($$('gridDatatable'), 'my_vocabulary');
                }
            },
            {
                view: 'icon',
                tooltip: _('pdf_export'),
                icon: 'file-pdf-o',
                click() {
                    webix.toPDF($$('gridDatatable'), {
                        filename: 'myVocabulary'
                    });
                }
            },
            {
                view: 'icon',
                tooltip: _('excel_export'),
                icon: 'file-excel-o',
                label: _('excel_export'),
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
                label: _('test_generate'),
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


            // $$('gridDatatable').parse(data);


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
