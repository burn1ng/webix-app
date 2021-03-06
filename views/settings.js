define([
    'locale'
], (_) => {
    let views = [
        {
            value: _('personal'),
            id: 'personal',
            href: '#!/app/settings/personal',
            icon: 'home'
        }
        // {
        //     value: _('other'),
        //     id: 'other',
        //     href: '#!/app/settings/other',
        //     icon: 'cogs'
        // }
    ];

    let menu = {
        view: 'tabbar',
        id: 'settings:menu',
        options: views,
        optionWidth: 150,
        click(id) {
            this.$scope.show(`./${this.getValue()}`);
        }
    };

    let ui = {
        rows: [
            menu,
            {$subview: true}
        ]
    };

    return {
        $ui: ui,
        $menu: 'settings:menu'
    };
});
