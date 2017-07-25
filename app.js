/*
	App configuration
*/

define([
	"libs/webix-jet-core/core",
	"libs/webix-jet-core/plugins/menu",
	"libs/webix-jet-core/plugins/theme",
	"libs/webix-jet-core/plugins/locale"
], function(
	core, menu, theme, locale
){

	//configuration
	var app = core.create({
		id:         "app-core-id",
		name:       "English App!",
		version:    "0.1.0",
		debug:      true,
		start:      "/sign-in"
	});

	app.use(menu);

	app.use(theme);
	app.use(locale);
	return app;
});