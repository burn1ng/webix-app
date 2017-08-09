const Word = require('../models/word');

module.exports = {
    // CREATE
    async createWord(ctx) {
        try {
            ctx.body = await Word.create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, 'Problem with adding word in database', {err});
        }
    },
    // READ
    async getWords(ctx) {
        try {
            ctx.body = await Word.find({});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find words in database', {err});
        }
    },
    // UPDATE
    async updateWord(ctx) {
        try {
            ctx.body = await Word.findByIdAndUpdate(
                ctx.request.body._id,
                {$set:
                    {
                        originalWord: ctx.request.body.originalWord,
                        translationWord: ctx.request.body.translationWord,
                        partOfSpeech: ctx.request.body.partOfSpeech
                    }
                },
                {new: true},
                (err, updatedWord) => {
                    if (err) return err;
                    return updatedWord;
                }
            );
        }
        catch (err) {
            ctx.throw(500, 'Problem with update word in database', {err});
        }
    }

    // other controllers

};
