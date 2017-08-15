define([], () => {
    // custom proxy for datatable editing in row, and upload ALL changes in 1 call to server
    webix.proxy.restWithDataProcessorDelay = {
        $proxy: true,
        load(view, callback) {
            webix.ajax(this.source, callback, view);
        },
        save(view, update, dp, callback) {
            return webix.delay(() => {
                webix.proxy.restWithDataProcessorDelay._save_logic.call(
                    this, view, update, dp, callback, webix.ajax()
                );
            });
        },

        _save_logic(view, update, dp, callback, ajax) {
            let url = this.source;
            let query = '';
            let mark = url.indexOf('?');

            if (mark !== -1) {
                query = url.substr(mark);
                url = url.substr(0, mark);
            }

            url += url.charAt(url.length - 1) == '/' ? '' : '/';
            let mode = update.operation;


            let data = update.data;
            if (mode === 'insert') delete data.id;

            // call restWithDataProcessorDelay URI
            if (mode === 'update') {
                ajax.put(url + data.id + query, data, callback);
            }
            else if (mode === 'delete') {
                ajax.del(url + data.id + query, data, callback);
            }
            else {
                ajax.post(url + query, data, callback);
            }
        }
    };

    let collection = new webix.DataCollection({
        url: 'api/getWords', // simple load data
        save: {
            url: 'restWithDataProcessorDelay->/api/word', // custom proxy
            updateFromResponse: true
        }
    });

    return {
        arrayOfWords: collection
    };
});
