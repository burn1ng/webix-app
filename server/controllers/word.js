const Word = require('../models/word');

module.exports = {
    // CREATE
    async createWord(ctx) {
        try {
            ctx.body = await Word.create(
                ctx.request.body,
                (err, word) => {
                    if (err) {
                        console.log(ctx);
                        throw err;
                    }
                    console.log('word created!');
                    console.log(word);
                });
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
            console.log(ctx);
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
                    if (err) throw err;
                    console.log('this is updatedWord \n');
                    console.log(updatedWord);
                    console.log('word is updated!');
                }
            );
        }
        catch (err) {
            ctx.throw(500, 'Problem with update word in database', {err});
        }
    },
    // DELETE
    async deleteWord(ctx) {
        try {
            // console.log(ctx.request.body);
            ctx.body = await Word.remove({_id: ctx.request.body._id}, () => {
                console.log('deleting is successfull');
            });
        }
        catch (err) {
            ctx.throw(500, 'Problem with deleting word from database', {err});
        }
    }
};
