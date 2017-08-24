define([
    'locale'
], (_) => {
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

    return {
        $ui: gridBottomToolbar
    };
});
