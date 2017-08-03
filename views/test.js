define([
    'models/menu_data',
    'models/multiview_cells',
    'https://cdn.webix.com/components/sidebar/sidebar.js'
], (menuData, multiviewCells) => ({
    rows: [{
        view: 'toolbar',
        padding: 3,
        elements: [{
            view: 'button',
            type: 'icon',
            icon: 'bars',
            width: 37,
            align: 'left',
            css: 'app_button',
            click() {
                $$('$sidebar1').toggle();
            }
        },
        {view: 'label', label: 'My App'},
        {},
        {view: 'button', type: 'icon', width: 45, css: 'app_button', icon: 'envelope-o', badge: 4},
        {view: 'button', type: 'icon', width: 45, css: 'app_button', icon: 'bell-o', badge: 10}
        ]
    },
    {
        cols: [{
            view: 'sidebar',
            data: menuData,
            on: {
                onAfterSelect(id) {
                    webix.message(`Selected: ${this.getItem(id).value}`);
                }
            },
            ready() {
                let firstItem = this.getFirstId();
                this.select(firstItem);
            }
        },
        {
            id: 'hui',
            view: 'template'
        }
        ]
    }
    ]
}));
