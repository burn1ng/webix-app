const Word = require('../models/word');

module.exports = {
    async getWords(ctx) {
        try {
            ctx.body = await Word.find({});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find words in database', {err});
        }
    }
    // other controllers

};
