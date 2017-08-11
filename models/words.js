define([], () => {
    let collection = new webix.DataCollection({
        url: 'rest->api/getWords',
        save: 'rest->/api/word',
        autoupdate: true
    });

    return {
        arrayOfWords: collection
    };
});
