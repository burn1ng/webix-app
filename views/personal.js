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
    let langUi = {
        view: 'segmented',
        name: 'language',
        label: _('language'),
        options: languages,
        click() {
            locales.setLang(this.getValue());
        }
    };

    let themenames = [
        {id: 'siberia:webix', value: _('siberia')},
        {id: 'siberia:skins/compact', value: _('compact')}
    ];
    let skinsUi = {
        view: 'segmented',
        name: 'theme',
        label: _('theme'),
        options: themenames,
        click() {
            console.log(themes);
            console.log(this.getValue());

            themes.setTheme(this.getValue());
        }
    };

    let personal = {
        view: 'form',
        elementsConfig: {
            labelPosition: 'left',
            labelWidth: 150,
            optionWidth: 200
        },
        elements: [
            {
                type: 'section',
                template: _('app_settings')
            },
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
