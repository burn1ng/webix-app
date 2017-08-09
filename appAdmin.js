/*
App configuration
*/
define([
    'libs/webix-jet-core/core',
    'libs/webix-jet-core/plugins/menu',
    'libs/webix-jet-core/plugins/theme',
    'libs/webix-jet-core/plugins/locale'
], (core, menu, theme, locale) => {
    // configuration
    let app = core.create({
        id: 'app-core-id',
        name: 'English App!',
        version: '0.1.0',
        debug: true,
        start: '/top/start'
    });

    webix.attachEvent('onBeforeAjax', (mode, url, data, request, headers) => {
        headers.Authorization = localStorage.getItem('token');
        console.log(headers);
    });

    app.use(menu);
    app.use(theme);
    app.use(locale);
    return app;
});
