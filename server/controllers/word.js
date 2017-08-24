const Word = require('../models/words');

module.exports = {
    // CREATE
    async createWord(ctx) {
        try {
            let currentUser = ctx.request.user;

            let newWord = await Word.create({
                _creator: currentUser,
                originalWord: ctx.request.body.originalWord,
                _wordGroup: ctx.request.body._wordGroup
            });

            ctx.body = newWord;
        }
        catch (err) {
            ctx.throw(500, 'Problem with adding word in database', {err});
        }
    },
    // READ
    async getWords(ctx) {
        try {
            ctx.body = await Word.find({_creator: ctx.request.user.id});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find words in database for that user', {err});
        }
    },
    // UPDATE
    async updateWord(ctx) {
        try {
            console.log(ctx);
            let req = ctx.request.body;
            ctx.body = await Word.findByIdAndUpdate(
                req._id,
                {$set:
                    {
                        originalWord: req.originalWord || '',
                        translationWord: req.translationWord || '',
                        partOfSpeech: req.partOfSpeech || 0
                    },
                $inc: {__v: 1}
                },
                {new: true},
                (err, updatedWord) => {
                    if (err) throw err;
                    console.log('this is updatedWord! \n');
                    console.log(updatedWord);
                    console.log('\n word is updated!');
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
            ctx.body = await Word.remove({_id: ctx.request.body._id}, () => {
                console.log('deleting word is successfull');
            });
        }
        catch (err) {
            ctx.throw(500, 'Problem with deleting word from database', {err});
        }
    }
};
