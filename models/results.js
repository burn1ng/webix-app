define([], () => {
    let collection = new webix.DataCollection({
        url: 'rest->api/results',
        save: {
            url: 'rest->api/results',
            updateFromResponse: true
        }
    });

    return {
        data: collection
    };
});
