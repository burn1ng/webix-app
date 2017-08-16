define([
    'views/wordsTable',
    'locale'
], (wordsTable, _) => {
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
        rows: [
            {view: 'label', label: _('wordgroup_name_label'), align: 'center'},
            {view: 'text', placeholder: _('wordgroup_name_placeholder'), name: 'wordgroupName'},
            {cols: [
                {view: 'button', label: _('add'), type: 'form'},
                {view: 'button', label: _('remove'), type: 'danger'}
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
                        testForm,
                        list
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
