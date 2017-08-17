define([
    'locale',
    'protected'
], (_, app) => ({
    $ui: {
        view: 'submenu',
        id: 'profilePopup',
        width: 200,
        padding: 0,
        data: [
            {id: 'myProfileLink', icon: 'user', value: _('my_profile'), href: '#!top/settings/personal'},
            {$template: 'Separator'},
            {id: 'logoutLink', icon: 'sign-out', value: _('logout')}
        ],
        type: {
            template(obj) {
                if (obj.type) { return "<div class='separator'></div>"; }
                return `<span class='webix_icon alerts fa-${obj.icon}'></span><span>${obj.value}</span>`;
            }
        },
        on: {
            onMenuItemClick(id) {
                if (id === 'logoutLink') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    window.location.href = '/public.html';
                }
            }
        }
    }
}));
