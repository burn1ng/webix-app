const Word = require('../models/word');

module.exports = {
    // CREATE
    async createWord(ctx) {
        try {
            ctx.body = await Word.create({
                originalWord: ctx.request.body.originalWord,
                userId: ctx.request.user.id
            });
            // push refs to children
            // User.findById(ctx.request.user.id).exec((err, currentUser) => {
            //     currentUser.words.push(word);
            //     currentUser.save();
            // });
        }
        catch (err) {
            ctx.throw(500, 'Problem with adding word in database', {err});
        }
    },
    // READ
    async getWords(ctx) {
        try {
            ctx.body = await Word.find({userId: ctx.request.user.id});
            // if we use populate method, and words array in user
            // User
            //     .findById(ctx.request.user.id)
            //     .populate('words') // only works if we pushed refs to children
            //     .exec((err, person) => {
            //         if (err) console.log(err);
            //         console.log(person);
            //     });
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
