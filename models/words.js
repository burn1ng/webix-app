define([], () => {
    let collection = new webix.DataCollection({
        url: 'api/getWords',
        save: 'rest->/api/word'
    });

    return {
        arrayOfWords: collection
    };
});
