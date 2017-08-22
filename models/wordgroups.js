define([], () => {
    let collection = new webix.DataCollection({
        url: 'api/getWordGroups',
        save: {
            url: 'rest->/api/wordgroup',
            updateFromResponse: true
        }
    });

    return {
        data: collection
    };
});
