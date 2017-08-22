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
        view: 'dataview',
        type: {
            height: 120
        },
        url: 'rest->api/getWordGroups',
        ready() {
            this.select(this.getFirstId());
        },
        select: true,
        scroll: false,
        on: {
            'data->onStoreLoad': function () {
                this.data.each((obj, i) => {
                    obj.count = obj.words.length;
                    console.log(obj);
                });
            }
        },
        template: '#wordGroupName# <div> Created: #createdAt#, <br /> Words: #count# </div>'
    };

    let form = {
        view: 'form',
        id: 'dashboard:form',
        rows: [
            {view: 'text', placeholder: _('wordgroup_name_placeholder'), name: 'wordgroupName'},
            {cols: [
                {view: 'button', label: _('add'), name: 'wordGroupName', type: 'form'},
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
            console.log($$('dashboard:list').data);
        }
    };
});
