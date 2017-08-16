define([
    'protected',
    'models/langState'
], (app, langState) => {
    let header = {
        type: 'header',
        template: app.config.name
    };

    let menu = {
        view: 'menu',
        id: 'topMenu',
        width: 180,
        layout: 'y',
        select: true,
        template: "<span class='webix_icon fa-#icon#'></span> #value# ",
        data: [
            {value: 'DashBoard', id: 'start', href: '#!/top/dashboard', icon: 'envelope-o'},
            {value: 'WordsTable View', id: 'data', href: '#!/top/wordsTable', icon: 'briefcase'},
            {value: 'Settings', id: 'settings', href: '#!/top/settings/personal', icon: 'cog'}
        ]
    };

    let ui = {
        type: 'line',
        cols: [{
            type: 'clean',
            css: 'app-left-panel',
            padding: 10,
            margin: 20,
            borderless: true,
            rows: [header, menu]
        },
        {
            rows: [
                {
                    height: 10
                },
                {
                    type: 'clean',
                    css: 'app-right-panel',
                    padding: 4,
                    rows: [
                        {$subview: true}
                    ]
                }
            ]
        }
        ]
    };

    return {
        $ui: ui,
        $menu: 'topMenu'
    };
});
