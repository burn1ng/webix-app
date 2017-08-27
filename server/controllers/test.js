const WordGroup = require('../models/wordgroups');
const Word = require('../models/words');
const Test = require('../models/tests');

module.exports = {
    // CREATE
    async generateTest(ctx) {
        let wordGroupId = ctx.request.body.wordGroupId;
        let countOfWords = ctx.request.body.count;

        if (!wordGroupId && !countOfWords) {
            ctx.status = 400;
            ctx.body = {message: 'Bad request for generating test for you, dude!'};
            return;
        }
        // create new Test
        try {
            let newTest = await Test.create(
                {
                    _wordGroup: wordGroupId,
                    score: 0
                }
            );
            console.log(newTest);
        }
        catch (err) {
            ctx.throw(500, 'Problem with creating test record in db', {err});
        }
        // get Random data for test
        const filter = {_wordGroup: wordGroupId};
        const fields = {originalWord: 1, translationWord: 1, partOfSpeech: 1};
        let options = {limit: countOfWords > 10 ? 10 : countOfWords};

        let promiseDecorator = new Promise((resolve, reject) => {
            Word.findRandom(filter, fields, options, (err, randomWords) => {
                if (err) { reject(err); }
                else { resolve(randomWords); }
            });
        });

        await promiseDecorator.then((randomWords) => {
            ctx.body = randomWords;
        }).catch((err) => {
            // TODO: remove current TEST from db
            ctx.throw(500, 'Problem with generating random data', {err});
        });
    }
};
