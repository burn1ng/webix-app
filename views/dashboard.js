define([
    'views/wordsTable',
    'locale'
], (wordsTable, _) => {
    let header = {
        type: 'header',
        template: _('wordgroup_header')
    };
    let list = {
        id: 'dashboard:list',
        view: 'list',
        data: ['Users', 'Reports', 'Settings'],
        ready() {
            this.select(this.getFirstId());
        },
        select: true,
        scroll: false,
        width: 250
    };

    let form = {
        view: 'form',
        id: 'dashboard:form',
        rows: [
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
                cols: [
                    {
                        rows: [
                            header,
                            list,
                            form
                        ]
                    },
                    {view: 'resizer'},
                    wordsTable
                ]
            }
        ]
    };

    return {
        $ui: ui,
        $menu: 'dashboard:list',
        $oninit: (view, $scope) => {

        }
    };
});
