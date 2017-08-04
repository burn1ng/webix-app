define([
    'models/words'
], (words) => {
    function addRow() {
        $$('gridDatatable').add({name: 'New item'});
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
        // url: '/getWords',
        view: 'datatable',
        select: 'row',
        // autoConfig: true
        resizeColumn: true,
        resizeRow: true,
        columns: [
            // {id: 'id', fillspace: 2, header: 'Id', sort: 'int'},
            {id: 'originalWord', fillspace: 2, editor: 'text', header: ['Original', {content: 'selectFilter'}]},
            {id: 'translationWord', fillspace: 2, editor: 'text', header: ['Translation', {content: 'textFilter'}]},
            {id: 'typeOfSpeech', fillspace: 1, editor: 'text', header: ['Type of speech', {content: 'selectFilter'}]}
            // {id: 'name', header: 'Name', editor: 'text', fillspace: 1},
            // {id: 'year', editor: 'text'},
            // {id: 'status', editor: 'select', options: ['', 'Active', 'Closed']}
        ],
        editable: true,
        editaction: 'dblclick'
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
                body: 'Data is updated'
            });

            $scope.on(words.arrayOfWords, 'onDataUpdate', () => {
                popup.show();
            });

            $$('gridDatatable').parse(words.arrayOfWords);
        }
    };
});
