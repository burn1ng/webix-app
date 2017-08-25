const WordGroup = require('../models/wordgroups');
const Word = require('../models/words');
const Test = require('../models/tests');

module.exports = {
    // CREATE
    async generateTest(ctx) {
        let wordGroupId = ctx.request.body.wordGroupId;
        console.log(`_wordGroup in req: ${wordGroupId}`);
        let countOfWords = ctx.request.body.count;
        console.log(`countOfWords in req: ${countOfWords}`);

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

        if (countOfWords > 0 && countOfWords <= 10) {
            let options = {limit: countOfWords};

            // Word.findRandom(filter, fields, options, (err, randomWords) => {
            //     if (!err) {
            //         console.log(randomWords);
            //         ctx.body = randomWords;
            //     }
            //     else {
            //         ctx.throw(500, 'Problem with generating data when countOfWords > 0 && <= 10', {err});
            //     }
            // });

            // ctx.body = 'ok';

            let promise = new Promise((resolve, reject) => {
                Word.findRandom(filter, fields, options, (err, randomWords) => {
                    err ? reject(err) : resolve(randomWords);
                });
            });

            promise.then(
                (randomWords) => {
                    console.log(randomWords);
                    ctx.body = randomWords;
                },
                (err) => {
                    ctx.throw(500, 'Problem with generating data when countOfWords > 0 && <= 10', {err});
                }
            );
        }
        else if (countOfWords > 10) {
            try {
                let options = {limit: 10};
                let randomWords = await Word.findRandom(filter, fields, options);
                ctx.body = randomWords;
            }
            catch (err) {
                ctx.throw(500, 'Problem with generating data when countOfWords > 10', {err});
            }
        }
    }
};
