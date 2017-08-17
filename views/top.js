define([
    'protected',
    'locale',
    'views/menus/profile',
    'views/menus/search'
], (app, _, profile, search) => {
    let header = {
        type: 'header',
        template: app.config.name
    };

    // Top toolbar
    let mainToolbar = {
        view: 'toolbar',
        id: 'mainToolbar',
        elements: [
            {view: 'label', label: "<a href='#'><img class='photo' src='assets/imgs/logo.png' /></a>", width: 200},
            {
                height: 46,
                id: 'personTemplate',
                css: 'header_person',
                borderless: true,
                width: 180,
                data: {name: localStorage.getItem('userName')},
                template(obj) {
                    let html = 	"<div style='height:100%;width:100%;' onclick='webix.$$(\"profilePopup\").show(this)'>";
                    html += `<img class='photo' src='assets/imgs/avatar.png' /><span class='name'>${obj.name}</span>`;
                    html += "<span class='webix_icon fa-angle-down'></span></div>";
                    return html;
                }
            },
            {},
            {view: 'icon', icon: 'search', width: 45, popup: 'searchPopup'}
        ]
    };

    let menu = {
        view: 'menu',
        id: 'top:menu',
        width: 180,
        margin: 1,
        layout: 'y',
        select: true,
        template: "<span class='webix_icon fa-#icon#'></span> #value# ",
        data: [
            {value: _('dashboard'), id: 'start', href: '#!/top/dashboard', icon: 'envelope-o'},
            {value: _('test_results'), id: 'data', href: '#!/top/wordsTable', icon: 'briefcase'},
            {value: _('settings'), id: 'settings', href: '#!/top/settings/personal', icon: 'cog'}
        ]
    };

    let ui = {
        type: 'line',
        rows: [
            mainToolbar,
            {
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
            }
        ]

    };

    return {
        $ui: ui,
        $menu: 'top:menu',
        $oninit(view, $scope) {
            $scope.ui(search.$ui);
            $scope.ui(profile.$ui);
        }
    };
});
