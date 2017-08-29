define([
    'locale'
], (_) => {
    function deleteRow(grid) {
        grid.remove(grid.getSelectedId(true));
    }
    function showDataStatus(grid) {
        if (!grid.count()) {
            grid.showOverlay(_('empty_data'));
        }
        else {
            grid.hideOverlay();
        }
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

    let resultsGrid = {
        id: 'resultsdDatatable',
        view: 'datatable',
        editable: false,
        url: 'rest->api/results',
        save: {
            url: 'rest->api/results',
            updateFromResponse: true
        },
        select: 'row',
        scroll: 'y',
        onClick: {
            webix_icon() {
                confirmDelete(this, _('test_result_confirm_delete'), deleteRow);
            }
        },
        ready() {
            this.select(this.getLastId());
        },
        on: {
            'data->onStoreUpdated': function () {
                this.data.each((testResult, i) => {
                    testResult.index = i + 1;
                    testResult.createdAt = new Date(Date.parse(testResult.createdAt));
                });
            },
            onBeforeLoad() {
                this.showOverlay(_('load_message'));
            },
            onAfterLoad() {
                showDataStatus(this);
            },
            onAfterDelete() {
                showDataStatus(this);
            }
        },
        columns: [
            {
                id: 'index',
                header: '№',
                width: 40,
                adjust: true
            },
            {
                id: 'createdAt',
                fillspace: 2,
                header: [_('result_created'), {content: 'dateFilter', placeholder: _('find_by_date_placeholder')}],
                format: webix.i18n.fullDateFormatStr,
                sort: 'date'
            },
            {
                id: 'score',
                fillspace: 1,
                header: [_('score'), {content: 'textFilter', placeholder: _('find_score_placeholder')}],
                sort: 'int'
            },
            {id: 'trash', header: '&nbsp;', width: 35, template: "<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
        ]
    };

    return {
        $ui: resultsGrid
    };
});
