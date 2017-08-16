define([
    'protected',
    'libs/webix-jet-core/plugins/locale',
    'libs/webix-jet-core/plugins/theme',
    'models/langState',
    'locale'
], (app, locales, themes, langState, _) => {
    let languages = [
        {id: 'ru', value: _('russian')},
        {id: 'en', value: _('english')}
    ];
    let langUi = {view: 'segmented',
        name: 'language',
        label: _('language'),
        options: languages,
        optionWidth: 120,
        click() { locales.setLang(this.getValue()); }
    };

    let themenames = [
        {id: 'siberia:webix', value: _('siberia')},
        {id: 'siberia:skins/compact', value: _('compact')}
    ];
    let skinsUi = {view: 'segmented',
        name: 'theme',
        label: _('theme'),
        options: themenames,
        optionWidth: 120,
        click() { themes.setTheme(this.getValue()); }
    };

    let personal = {view: 'form',
        rows: [
            {type: 'section', template: _('app_settings')},
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
