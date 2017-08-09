define([
    'models/words'
], (words) => {
    function addRow() {
        $$('gridDatatable').add({originalWord: 'New word', translationWord: 'Translation', partOfSpeech: '0'});
    }
    function deleteRow() {
        $$('gridDatatable').remove($$('gridDatatable').getSelectedId(true));
    }

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
        view: 'datatable',
        editable: true,
        editaction: 'custom',
        resizeColumn: true,
        resizeRow: true,
        on: {
            onItemClick(id) {
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

            $scope.on(words.arrayOfWords, 'onDataUpdate', () => {
                popup.show();
            });

            $$('gridDatatable').parse(words.arrayOfWords);
        }
    };
});
