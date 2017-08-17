define([
    'models/words',
    'locale'
], (words, _) => {
    function addRow(grid) {
        grid.add({originalWord: 'New word', translationWord: '', partOfSpeech: 0});
    }
    function deleteRow(grid) {
        grid.remove(grid.getSelectedId(true));
    }
    function deleteAllRows(grid) {
        let allRows = [];
        grid.eachRow(
            (row) => {
                allRows.push(grid.getItem(row).id);
            }
        );
        grid.remove(allRows);
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

    let gridTopToolbar = {
        id: 'gridTopToolbar',
        view: 'toolbar',
        elements: [
            {view: 'button',
                autowidth: true,
                type: 'iconButton',
                icon: 'calendar-plus-o',
                label: _('add_row'),
                click() {
                    addRow($$('gridDatatable'));
                }
            },
            {view: 'button',
                autowidth: true,
                type: 'iconButton',
                icon: 'calendar-minus-o',
                label: _('del_row'),
                click() {
                    let selectedItems = $$('gridDatatable').getState().select.length;

                    if (selectedItems > 1) {
                        confirmDelete($$('gridDatatable'), _('selected_words_confirm_delete'), deleteRow);
                    }
                    else if (selectedItems === 1) {
                        confirmDelete($$('gridDatatable'), _('word_confirm_delete'), deleteRow);
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
                    confirmDelete($$('gridDatatable'), _('all_words_confirm_delete'), deleteAllRows, 'confirm-error');
                }
            }
        ]
    };

    let grid = {
        id: 'gridDatatable',
        url: 'api/getWords',
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
                this.data.each((obj, i) => {
                    obj.index = i + 1;
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
                // save prev edit, open editor on all cells simultaneously
                // and focus on the first column (not index)
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

    let gridBottomToolbar = {
        id: 'gridBottomToolbar',
        view: 'toolbar',
        height: 46,
        elements: [
            {
                view: 'button',
                type: 'iconButton',
                icon: 'trophy',
                label: _('test_results'),
                autowidth: true,
                click() {
                    // TODO
                }
            },
            {},
            {
                view: 'icon',
                icon: 'file-image-o',
                tooltip: _('png_export'),
                width: 66,
                click() {
                    webix.toPNG($$('gridDatatable'), 'my_vocabulary');
                }
            },
            {
                view: 'icon',
                icon: 'file-pdf-o',
                tooltip: _('pdf_export'),
                width: 66,
                click() {
                    webix.toPDF($$('gridDatatable'), {
                        filename: 'myVocabulary'
                    });
                }
            },
            {
                view: 'icon',
                icon: 'file-excel-o',
                tooltip: _('excel_export'),
                width: 66,
                click() {
                    webix.toExcel($$('gridDatatable'), {
                        filename: 'myVocabulary',
                        name: 'English words',
                        filterHTML: true,
                        columns: {
                            index: {header: '#'},
                            originalWord: {header: _('orig_word'), width: 350},
                            translationWord: {header: _('translation'), width: 400},
                            partOfSpeech: {header: _('part_of_speech'), width: 200}
                        }
                    });
                }
            },
            {},
            {
                view: 'button',
                type: 'iconButton',
                icon: 'cog',
                label: _('test_generate'),
                autowidth: true,
                click() {
                    // TODO
                }
            }
        ]
    };

    let ui = {
        view: 'layout',
        id: 'wordsTable',
        rows: [
            gridTopToolbar,
            grid,
            gridBottomToolbar
        ]
    };

    return {
        $ui: ui
        // $oninit: (view, $scope) => {
        // let popup = $scope.ui({
        //     view: 'popup',
        //     position: 'center',
        //     body: 'New word added to your vocabulary and saved.'
        // });
        // $scope.on(words.arrayOfWords, 'onDataUpdate', () => {
        //     popup.show();
        // });
        // $$('gridDatatable').data.sync(words.arrayOfWords);


        // $$('gridDatatable').parse(data);


        // words.arrayOfWords.attachEvent('onBeforeLoad', () => {
        //     $$('gridDatatable').showOverlay('Loading...');
        // });
        // words.arrayOfWords.attachEvent('onAfterLoad', () => {
        //     showDataStatus($$('gridDatatable'));
        // });
        // words.arrayOfWords.attachEvent('onAfterDelete', () => {
        //     showDataStatus($$('gridDatatable'));
        // });
        // words.arrayOfWords.attachEvent('onAfterAdd', () => {
        //     showDataStatus($$('gridDatatable'));
        // });
        // }
    };
});
