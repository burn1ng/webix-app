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

    let urlWithoutHeaders = '//cdn.webix.com/extras/xlsx.core.min.js';

    webix.attachEvent('onBeforeAjax', (mode, url, data, request, headers) => {
        console.log('onBeforeAjax event fired: \n');
        // we need to check url, because webix CDN don't allow Authorization token
        if (url.substring(0, urlWithoutHeaders.length) !== urlWithoutHeaders) {
            headers.Authorization = localStorage.getItem('token');
        }
    });

    webix.attachEvent('onAjaxError', (requestObj) => {
        console.log('onAjaxError event fired');
        window.location.href = '/public.html';
    });

    webix.attachEvent('onLoadError', (text, xml, xhttp, obj) => {
        console.log('onLoadError event fired');
        window.location.href = '/public.html';
    });

    app.use(menu);
    app.use(theme);
    app.use(locale);
    return app;
});
