define([
    'protected',
    'libs/webix-jet-core/plugins/locale',
    'libs/webix-jet-core/plugins/theme'
], (app, locales, themes) => {
    let languages = [
        {id: 'ru', value: 'Russian'},
        {id: 'en', value: 'English'}
    ];
    let langUi = {view: 'segmented',
        name: 'language',
        label: 'Language',
        options: languages,
        optionWidth: 120,
        click() { locales.setLang(this.getValue()); }
    };

    let themenames = [
        {id: 'siberia:webix', value: 'Siberia'},
        {id: 'siberia:skins/compact', value: 'Compact'}
    ];
    let skinsUi = {view: 'segmented',
        name: 'theme',
        label: 'Theme',
        options: themenames,
        optionWidth: 120,
        click() { themes.setTheme(this.getValue()); }
    };

    let personal = {view: 'form',
        rows: [
            {type: 'section', template: 'App settings'},
            langUi,
            skinsUi,
            {}
        ]};

    let view = {
        $ui: personal,
        $oninit: (view) => {
            view.elements.language.setValue(locales.getLang());
            view.elements.theme.setValue(themes.getThemeId());
        }
    };

    return view;
});
