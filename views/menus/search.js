define([
    'locale'
], (_) => {
    let search = {
        view: 'popup',
        id: 'searchPopup',
        width: 300,
        body: {
            rows: [
                {
                    view: 'search'
                },
                {
                    borderless: true, css: 'extended_search', template: `<span>${_('extended_search')}</span>`, height: 40
                }
            ]

        }
    };
    return {
        $ui: search
    };
});
