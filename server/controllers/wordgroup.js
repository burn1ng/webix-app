const WordGroup = require('../models/wordgroup');

module.exports = {
    // CREATE
    async createWordGroup(ctx) {
        ctx.body = await WordGroup.create(
            ctx.request.body,
            (err, wordgroup) => {
                if (err) {
                    console.log(ctx.request.body);
                    ctx.throw(500, 'Problem with adding wordgroup in database', {err});
                }
                console.log('wordgroup created!');
                console.log(wordgroup);
            }
        );
    },
    // READ
    async getWordGroups(ctx) {
        try {
            ctx.body = await WordGroup.find({});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find words in database', {err});
        }
    },
    // UPDATE
    async updateWordGroup(ctx) {
        try {
            console.log(ctx);
            ctx.body = await WordGroup.findByIdAndUpdate(
                ctx.request.body._id,
                {$set:
                    {
                        originalWord: ctx.request.body.originalWord,
                        translationWord: ctx.request.body.translationWord,
                        partOfSpeech: ctx.request.body.partOfSpeech
                    },
                $inc: {__v: 1}
                },
                {new: true},
                (err, updatedWordGroup) => {
                    if (err) throw err;
                    console.log('this is updatedWord! \n');
                    console.log(updatedWordGroup);
                    console.log('\n word is updated!');
                }
            );
        }
        catch (err) {
            ctx.throw(500, 'Problem with update word in database', {err});
        }
    },
    // DELETE
    async deleteWordGroup(ctx) {
        try {
            ctx.body = await WordGroup.remove({_id: ctx.request.body._id}, () => {
                console.log('deleting is successfull');
            });
        }
        catch (err) {
            ctx.throw(500, 'Problem with deleting word from database', {err});
        }
    }
};
