define([
    'views/wordsTable',
    'locale'
], (wordsTable, _) => {
    function addItemToMaster(masterView, changingFieldName, inputId) {
        let item = {
            rank: $$(masterView).count() + 1
        };
        item[changingFieldName] = $$(inputId).getValue();
        $$(masterView).add(item);
    }
    function removeItemFromMaster(masterView) {
        let selectedItems = $$(masterView).getSelectedId(true);
        if (!selectedItems) return;
        for (let i = 0; i < selectedItems.length; i++) {
            $$(masterView).remove(selectedItems[i]);
        }
    }
    function updateItemInMaster(masterView, slaveInputId, updatingField) {
        let selectedItems = $$(masterView).getSelectedId(true);
        if (!selectedItems) return;
        let value = document.getElementById(slaveInputId).value;
        for (let i = 0; i < selectedItems.length; i++) {
            let item = $$(masterView).getItem(selectedItems[i]);
            item[updatingField] = value;
            $$(masterView).updateItem(selectedItems[i], item);
        }
    }

    let wordGroupList = {
        rows: [
            {
                id: 'wordGroupList:header',
                type: 'header',
                template: _('wordgroup_header')
            },
            {
                id: 'wordGroupList:dataview',
                view: 'dataview',
                select: 'multiselect',
                scroll: false,
                width: 250,
                url: 'rest->api/getWordGroups',
                // save: {
                //     url: 'rest->api/wordgroup',
                //     updateFromResponse: true
                // },
                // ready() {
                //     this.select(this.getFirstId());
                // },
                on: {
                    'data->onStoreLoad': function () {
                        this.data.each((obj, i) => {
                            obj.rank = i + 1;
                            obj.count = obj.words.length;
                            obj.createdAt = new Date(obj.createdAt).toLocaleString('en-US');
                            obj.updatedAt = new Date(obj.updatedAt).toLocaleString('en-US');
                            console.log(obj);
                        });
                    }
                },
                type: {
                    template: '#rank#. #wordGroupName#' +
                    '<div class="wordgroup-timestamp"> Created: #createdAt# </div>' +
                    '<div class="wordgroup-timestamp"> Updated: #updatedAt# </div>' +
                    'Words: #count#',
                    width: 'auto',
                    height: 'auto'
                },
                xCount: 1,
                yCount: 8
            }
        ]
    };

    let wordGroupForm = {
        view: 'form',
        id: 'wordGroupForm:form',
        save: {
            url: 'rest->api/wordgroup'
        },
        rows: [
            {
                view: 'text',
                id: 'formInputValue',
                placeholder: _('wordgroup_name_placeholder'),
                value: '',
                name: 'wordgroupName'
            },
            {
                cols: [
                    {
                        view: 'button',
                        label: _('add'),
                        name: 'wordGroupName',
                        type: 'form',
                        click() {
                            addItemToMaster('wordGroupList:dataview', 'wordGroupName', 'formInputValue');
                        }
                    },
                    {
                        view: 'button',
                        label: _('remove'),
                        type: 'danger',
                        click() {
                            removeItemFromMaster('wordGroupList:dataview');
                        }
                    }
                ]
            }
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
                            wordGroupList,
                            wordGroupForm
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
        $menu: 'wordGroupList:dataview',
        $oninit: (view, $scope) => {
            console.log($$('wordGroupList:dataview').data);

            $$('wordGroupList:dataview').attachEvent('onAfterSelect', function (id) {
                // we use this, t.w. arrow function can't be here
                let selectedValue = this.getItem(id).wordGroupName;
                $$('formInputValue').setValue(selectedValue);
            });

            let dp = new webix.DataProcessor({
                master: $$('wordGroupList:dataview'),
                url: 'rest->api/getWordGroups'
            });
        }
    };
});
