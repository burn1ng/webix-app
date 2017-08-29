define([
    'locale',
    'views/grid/gridTopToolbar',
    'views/grid/grid',
    'views/grid/gridBottomToolbar'
], (_, gridTopToolbar, grid, gridBottomToolbar) => {
    function addItemToMaster(masterView, changingFieldName, inputId) {
        let item = {
            count: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        item[changingFieldName] = $$(inputId).getValue() || _('new_group');
        $$(masterView).add(item);
    }

    function removeItemFromMaster(masterView) {
        let selectedItems = $$(masterView).getSelectedId(true);

        if (!selectedItems) return;

        for (let i = 0; i < selectedItems.length; i++) {
            $$(masterView).remove(selectedItems[i]);
        }
    }
    function updateItemInMaster(masterView, changingFieldName, inputId) {
        let selectedItems = $$(masterView).getSelectedId(true);

        if (!selectedItems) return;

        for (let i = 0; i < selectedItems.length; i++) {
            let item = $$(masterView).getItem(selectedItems[i]);
            item[changingFieldName] = $$(inputId).getValue() || _('new_group');
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
                select: true,
                width: 250,
                url: 'api/wordgroups',
                save: {
                    url: 'rest->/api/wordgroup',
                    updateFromResponse: true
                },
                on: {
                    onItemRender() {
                        this.data.each((wordgroup, i) => {
                            wordgroup.index = i + 1;
                            wordgroup.createdAt = new Date(wordgroup.createdAt).toLocaleString('en-US');
                            wordgroup.updatedAt = new Date(wordgroup.updatedAt).toLocaleString('en-US');
                        });
                    },
                    onItemClick() {
                        // prevent datatable editing error
                        return !$$('gridDatatable').getEditState();
                    },
                    onAfterSelect(id) {
                        // push name of group to form input
                        let selectedItem = this.getItem(id);
                        let selectedValue = this.getItem(id).wordGroupName;
                        $$('formInputValue').setValue(selectedValue);
                        $$('gridDatatable').clearAll();

                        // load data to datatable by item id
                        let query = `id=${selectedItem._id}`;
                        let promise = webix.ajax().get('api/wordgroup/', query);

                        promise.then((words) => {
                            let data = words.json();
                            $$('gridDatatable').parse(data);
                        });
                    }
                },
                type: {
                    template: '#index#. #wordGroupName#' +
                    '<div class="wordgroup-timestamp"> Created: #createdAt# </div>' +
                    '<div class="wordgroup-timestamp"> Updated: #updatedAt# </div>' +
                    'Words: #count#',
                    width: 'auto',
                    height: 'auto'
                },
                xCount: 1,
                yCount: 7
            }
        ]
    };

    let wordGroupForm = {
        view: 'form',
        id: 'wordGroupForm:form',
        rows: [
            {
                view: 'text',
                id: 'formInputValue',
                placeholder: _('wordgroup_name_placeholder'),
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
                            $$('formInputValue').setValue('');
                            $$('gridDatatable').clearAll();
                        }
                    }
                ]
            },
            {
                cols: [
                    {
                        view: 'button',
                        label: _('update'),
                        click() {
                            updateItemInMaster('wordGroupList:dataview', 'wordGroupName', 'formInputValue');
                        }
                    },
                    {
                        view: 'button',
                        label: _('unselect'),
                        click() {
                            $$('wordGroupList:dataview').unselectAll();
                            $$('gridDatatable').clearAll();
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
                    {
                        rows: [
                            gridTopToolbar,
                            grid,
                            gridBottomToolbar
                        ]
                    }
                ]
            }
        ]
    };

    return {
        $ui: ui,
        $menu: 'wordGroupList:dataview',
        $oninit: (view, $scope) => {
            let dp = new webix.DataProcessor({
                master: $$('wordGroupList:dataview')
            });
        }

    };
});
