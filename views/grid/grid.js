define([
    'locale'
], (_) => {
    function updateDataViewItem(item) {
        item.count -= 1;
        item.updatedAt = Date.now();
        $$('wordGroupList:dataview').updateItem(item.id);
    }
    function deleteRow(grid) {
        try {
            let selectedWordGroup = $$('wordGroupList:dataview').getSelectedItem();
            grid.remove(grid.getSelectedId(true));
            updateDataViewItem(selectedWordGroup);
        }
        catch (error) {
            grid.remove(grid.getSelectedId(true));
        }
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

    // custom proxy for datatable editing in row, and upload ALL changes in 1 call to server
    webix.proxy.restWithDataProcessorDelay = {
        $proxy: true,
        load(view, callback) {
            webix.ajax(this.source, callback, view);
        },
        save(view, update, dp, callback) {
            return webix.delay(() => {
                webix.proxy.restWithDataProcessorDelay._save_logic.call(
                    this, view, update, dp, callback, webix.ajax()
                );
            });
        },

        _save_logic(view, update, dp, callback, ajax) {
            let url = this.source;
            let query = '';
            let mark = url.indexOf('?');

            if (mark !== -1) {
                query = url.substr(mark);
                url = url.substr(0, mark);
            }

            url += url.charAt(url.length - 1) === '/' ? '' : '/';
            let mode = update.operation;


            let data = update.data;
            if (mode === 'insert') delete data.id;

            // call restWithDataProcessorDelay URI
            if (mode === 'update') {
                ajax.put(url + data.id + query, data, callback);
            }
            else if (mode === 'delete') {
                ajax.del(url + data.id + query, data, callback);
            }
            else {
                ajax.post(url + query, data, callback);
            }
        }
    };

    // custom summColumn logic for footer's total of rows
    webix.ui.datafilter.customSummColumn = webix.extend({
        refresh(master, node) {
            node.firstChild.innerHTML = master.count();
        }
    }, webix.ui.datafilter.summColumn);

    // custom textFilter logic for render icon in the right corner of input
    webix.ui.datafilter.customTextFilter = webix.extend({
        render(master, config) {
            if (this.init) this.init(config);
            config.css = 'webix_ss_filter';
            // render input and icon
            return `<input ${config.placeholder ?
                `placeholder="${config.placeholder}" ` : ''}type='text'>` +
            ' type=\'text\'><span class=\'webix_icon fa-search\'></span></input>';
        }
    }, webix.ui.datafilter.textFilter);

    let grid = {
        id: 'gridDatatable',
        url: 'api/words',
        save: {
            url: 'restWithDataProcessorDelay->/api/word',
            updateFromResponse: true
        },
        view: 'datatable',
        editable: true,
        resizeColumn: true,
        resizeRow: true,
        select: 'row',
        scroll: 'y',
        multiselect: true,
        editaction: 'dblclick',
        footer: true,
        onClick: {
            webix_icon() {
                confirmDelete(this, _('word_confirm_delete'), deleteRow);
            }
        },
        on: {
            'data->onStoreUpdated': function () {
                this.data.each((word, i) => {
                    word.index = i + 1;
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
            },
            onAfterAdd() {
                showDataStatus(this);
                if (this.getEditState()) {
                    this.editStop();
                }
                let id = this.getLastId();
                this.editRow(id);
                this.getEditor({row: id, column: 'originalWord'}).focus();
            }
        },
        columns: [
            {
                id: 'index',
                header: '№',
                width: 40,
                editor: false,
                adjust: true,
                footer: {content: 'customSummColumn', css: 'sample_footer'}
            },
            {
                id: 'originalWord',
                fillspace: 2,
                editor: 'text',
                header: [_('orig_word'), {content: 'customTextFilter', placeholder: _('find_word')}],
                sort: 'string',
                footer: {text: _('words_amount'), colspan: 4, css: 'sample_footer'}
            },
            {
                id: 'translationWord',
                fillspace: 4,
                editor: 'text',
                header: [_('translation'), {content: 'customTextFilter', placeholder: _('find_translation')}],
                sort: 'string'
            },
            {
                id: 'partOfSpeech',
                fillspace: 1,
                editor: 'select',
                header: [_('part_of_speech'), {content: 'selectFilter'}],
                collection: [
                    {id: 1, value: _('verb')},
                    {id: 2, value: _('noun')},
                    {id: 3, value: _('adjective')},
                    {id: 4, value: _('adverb')},
                    {id: 5, value: _('pronoun')},
                    {id: 6, value: _('preposition')},
                    {id: 7, value: _('conjunction')},
                    {id: 8, value: _('interjection')}
                ],
                sort: 'string'
            },
            {id: 'trash', header: '&nbsp;', width: 35, template: "<span  style='color:#777777; cursor:pointer;' class='webix_icon fa-trash-o'></span>"}
        ]
    };

    return {
        $ui: grid
    };
});
