define([
    // 'models/words'
    'views/wordsTable'
], (wordsTable) => {
    let list = {
        view: 'list',
        data: ['Users', 'Reports', 'Settings'],
        ready() {
            this.select(this.getFirstId());
        },
        select: true,
        scroll: false,
        width: 250
    };

    let testForm = {
        view: 'form',
        elements: [
            {view: 'text', label: 'Group Name', placeholder: 'New group'},
            {cols: [
                {view: 'button', value: 'Add', type: 'form'},
                {view: 'button', value: 'Add', label: 'Remove', type: 'danger'}
            ]}
        ]
    };

    let ui = {
        id: 'dashboard',
        rows: [
            {
                type: 'form',
                padding: 0,
                responsive: 'dashboard',
                cols: [
                    {rows: [
                        list,
                        testForm
                    ]},

                    {view: 'resizer'},
                    // {template: 'column 2', width: 200},
                    wordsTable
                ]
            }

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
