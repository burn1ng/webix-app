define([
    'protected',
    'locale'
], (app, _) => {
    function updateDataViewItem(item, action, amount) {
        switch (action) {
            case 'add':
                item.count += 1;
                break;
            case 'delete':
                if (amount > 1) {
                    item.count -= amount;
                }
                else {
                    item.count -= 1;
                }
                break;
            case 'deleteAll':
                item.count = 0;
                break;
            default:
                webix.message('Unknown action!');
        }
        item.updatedAt = Date.now();
        $$('wordGroupList:dataview').updateItem(item.id);
    }
    function addRow(grid) {
        let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
        if (selectedWordGroup) {
            grid.add({originalWord: 'New word', translationWord: '', partOfSpeech: 0, _wordGroup: selectedWordGroup._id});
            updateDataViewItem(selectedWordGroup, 'add');
        }
        else {
            webix.message({type: 'warning', text: 'Please, select wordgroup if you want to add new word'});
        }
    }
    function deleteRow(grid) {
        try {
            let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
            let itemsToRemove = grid.getSelectedId(true);
            grid.remove(itemsToRemove);
            updateDataViewItem(selectedWordGroup, 'delete', itemsToRemove.length);
        }
        catch (error) {
            grid.remove(grid.getSelectedId(true));
        }
    }
    function deleteAllRows(grid) {
        let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
        let allRows = [];
        grid.eachRow(
            (row) => {
                allRows.push(grid.getItem(row).id);
            }
        );
        grid.remove(allRows);
        updateDataViewItem(selectedWordGroup, 'deleteAll');
    }
    function confirmDelete(grid, textMessage, successCallback, type) {
        webix.confirm({
            text: textMessage,
            type: type || 'confirm-warning',
            ok: _('yes'),
            cancel: _('cancel'),
            callback(res) {
                if (res) {
                    successCallback(grid);
                }
            }
        });
    }

    let gridTopToolbar = {
        id: 'gridTopToolbar',
        view: 'toolbar',
        elements: [
            {
                view: 'button',
                autowidth: true,
                type: 'iconButton',
                icon: 'calendar-plus-o',
                label: _('add_row'),
                click() {
                    if ($$('wordGroupList:dataview')) {
                        addRow($$('gridDatatable'));
                    }
                    else {
                        webix.message({type: 'warning', text: 'Please, add new words only for certain group in dashboard'});
                        app.show('top/dashboard');
                    }
                }
            },
            {
                view: 'button',
                autowidth: true,
                type: 'iconButton',
                icon: 'calendar-minus-o',
                label: _('del_row'),
                click() {
                    let selectedItems = $$('gridDatatable').getSelectedId(true, true).length;

                    if (selectedItems > 1) {
                        confirmDelete($$('gridDatatable'), _('selected_words_confirm_delete'), deleteRow);
                    }
                    else if (selectedItems === 1) {
                        confirmDelete($$('gridDatatable'), _('word_confirm_delete'), deleteRow);
                    }
                    else {
                        webix.message({type: 'warning', text: 'Please, at first select words which you want to delete'});
                    }
                }},
            {},
            {
                view: 'button',
                type: 'icon',
                icon: 'calendar-times-o',
                label: _('del_all_rows'),
                autowidth: true,
                click() {
                    let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
                    if (selectedWordGroup) {
                        let countOfRows = $$('gridDatatable').count();
                        if (countOfRows > 0) {
                            confirmDelete($$('gridDatatable'), _('all_words_confirm_delete'), deleteAllRows, 'confirm-error');
                        }
                        else {
                            webix.message({type: 'warning', text: 'There are no words to delete in this wordgroup'});
                        }
                    }
                    else {
                        webix.message({type: 'warning', text: 'Please, at first select wordgroup, which you want to clean'});
                    }
                }
            }
        ]
    };

    return {
        $ui: gridTopToolbar
    };
});
