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
        start: '/top/dashboard'
    });

    // webix.debug = true;

    webix.attachEvent('onBeforeAjax', (mode, url, data, request, headers) => {
        console.log('onBeforeAjax event fired: \n');
        console.log(data);
        // we need to check url, because webix CDN don't allow Authorization token
        if (url.substring(0, 15) !== '//cdn.webix.com') {
            headers.Authorization = localStorage.getItem('token');
        }
    });

    webix.attachEvent('onAjaxError', () => {
        console.log('onAjaxError event fired');
        window.location.href = '/public.html';
    });

    webix.attachEvent('onLoadError', () => {
        console.log('onLoadError event fired');
        window.location.href = '/public.html';
    });

    app.use(menu);
    app.use(theme);
    app.use(locale, {lang: 'en'});
    return app;
});
