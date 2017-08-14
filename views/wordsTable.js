define([
    // 'models/words'
], (words) => {
    function addRow() {
        $$('gridDatatable').add({originalWord: ' ', translationWord: ' ', partOfSpeech: 0});
    }
    function deleteRow() {
        $$('gridDatatable').remove($$('gridDatatable').getSelectedId(true));
    }

    // custom proxy for datatable editing in row, and upload ALL changes in 1 call to server

    webix.proxy.restWithDataProcessorDelay = {
        $proxy: true,
        load(view, callback) {
            webix.ajax(this.source, callback, view);
        },
        save(view, update, dp, callback) {
            return webix.delay(() => {
                webix.proxy.restWithDataProcessorDelay._save_logic.call(this, view, update, dp, callback, webix.ajax());
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
        multiselect: true,
        editaction: 'custom',
        on: {
            onItemDblClick(id) {
                this.editRow(id);
            }
        },
        columns: [
            {id: 'originalWord', fillspace: 2, editor: 'text', header: ['Original word', {content: 'textFilter'}]},
            {id: 'translationWord', fillspace: 3, editor: 'text', header: ['Translation', {content: 'textFilter'}]},
            {
                id: 'partOfSpeech',
                fillspace: 1,
                editor: 'select',
                header: ['Part of speech',
                    {
                        content: 'selectFilter',
                        sort: 'string',
                        empty: true
                    }
                ],
                collection: [
                    {id: 1, value: 'Verb'},
                    {id: 2, value: 'Noun'},
                    {id: 3, value: 'Adjective'},
                    {id: 4, value: 'Adverb'},
                    {id: 5, value: 'Pronoun'},
                    {id: 6, value: 'Preposition'},
                    {id: 7, value: 'Conjunction'},
                    {id: 8, value: 'Interjection'}
                ]
            }
        ]
    };


    let ui = {
        rows: [
            toolbar,
            grid
        ]
    };

    return {
        $ui: ui,
        $oninit: (view, $scope) => {
            let popup = $scope.ui({
                view: 'popup',
                position: 'center',
                body: 'New word added to your vocabulary and saved.'
            });

            // $scope.on(words.arrayOfWords, 'onDataUpdate', () => {
            //     popup.show();
            // });

            // $$('gridDatatable').parse(words.arrayOfWords);
        }
    };
});
