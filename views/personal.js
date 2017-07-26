define([
  'app',
  'libs/webix-jet-core/plugins/locale',
  'libs/webix-jet-core/plugins/theme'
], function (app, locales, themes) {
  var languages = [
{ id: 'ru', value: 'Russian' },
{ id: 'en', value: 'English' }
  ]
  var langUi = { view: 'segmented',
    name: 'language',
    label: 'Language',
    options: languages,
    optionWidth: 120,
    click: function () { locales.setLang(this.getValue()) }
  }

  var themenames = [
{ id: 'siberia:webix', value: 'Siberia' },
{ id: 'siberia:skins/compact', value: 'Compact' }
  ]
  var skinsUi = { view: 'segmented',
    name: 'theme',
    label: 'Theme',
    options: themenames,
    optionWidth: 120,
    click: function () { themes.setTheme(this.getValue()) }
  }

  var personal = { view: 'form',
    rows: [ {type: 'section', template: 'App settings'}, langUi, skinsUi, {} ]
  }

  var view = {
    $ui: personal,
    $oninit: function (view) {
      view.elements.language.setValue(locales.getLang())
      view.elements.theme.setValue(themes.getThemeId())
    }
  }

  return view
})
