define([], () => {
    let collection = new webix.DataCollection({
        url: '/getWords',
        save: 'rest->/word'
    });

    return {
        arrayOfWords: collection
    };
});
