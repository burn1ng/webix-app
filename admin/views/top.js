define([
    'app'
], (app) => {
    let header = {
        type: 'header',
        template: app.config.name
    };

    let menu = {
        view: 'menu',
        id: 'top:menu',
        width: 180,
        layout: 'y',
        select: true,
        template: "<span class='webix_icon fa-#icon#'></span> #value# ",
        data: [
            {value: 'DashBoard', id: 'start', href: '#!/top/start', icon: 'envelope-o'},
            {value: 'Data', id: 'data', href: '#!/top/wordsTable', icon: 'briefcase'},
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
            rows: [{height: 10},
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
        $menu: 'top:menu'
    };
});