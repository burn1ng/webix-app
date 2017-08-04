define([], () => {
    let collection = new webix.DataCollection({
        url: '/getWords',
        save: 'rest->/addWord'
    });

    return {
        arrayOfWords: collection
    };
});
