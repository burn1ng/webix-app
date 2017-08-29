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
        function shuffle(a) {
            for (let i = a.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [a[i - 1], a[j]] = [a[j], a[i - 1]];
            }
        }
        try {
            let jsonResponse = [];

            let typeOfTest = +ctx.request.body.typeOfTest; // convert to number

            let findRandomQuestions = await new Promise((resolve, reject) => {
                let filter = {_wordGroup: wordGroupId};
                let fields = {originalWord: 1, translationWord: 1, partOfSpeech: 1};
                let options = {limit: countOfWords > 10 ? 10 : countOfWords};
                Word.findRandom(filter, fields, options, (err, randomQuestions) => {
                    if (err) { reject(err); }
                    else { resolve(randomQuestions); }
                });
            });

            await Promise.all(findRandomQuestions.map(async (randomQuestion, i) => {
                let quest = typeOfTest === 0 ?
                    randomQuestion.originalWord : randomQuestion.translationWord;
                let ans = typeOfTest === 0 ?
                    randomQuestion.translationWord : randomQuestion.originalWord;

                jsonResponse[i] = {
                    question: quest,
                    questionPartOfSpeech: randomQuestion.partOfSpeech,
                    correctAnswer: ans
                };

                let findRandomVariants = await new Promise((resolve, reject) => {
                    let filter = {
                        partOfSpeech: randomQuestion.partOfSpeech,
                        originalWord: {$ne: randomQuestion.originalWord} // or translation $ne randquest.translation
                    };
                    let fields = {[typeOfTest === 0 ? 'translationWord' : 'originalWord']: 1};
                    let options = {limit: 3};
                    Word.findRandom(filter, fields, options, (err, randomVariants) => {
                        if (err) { reject(err); }
                        else { resolve(randomVariants); }
                    });
                });


                let middleArr = findRandomVariants.map((randomVariant) => {
                    let variantValue = typeOfTest === 0 ? randomVariant.translationWord :
                        randomVariant.originalWord;

                    return variantValue;
                });

                middleArr.push(typeOfTest === 0 ? randomQuestion.translationWord :
                    randomQuestion.originalWord);

                shuffle(middleArr);

                jsonResponse[i].variants = middleArr;
            }));
            console.log(typeof JSON.stringify(jsonResponse));
            ctx.body = JSON.stringify(jsonResponse);
        }
        catch (err) {
            ctx.throw(500, 'Problem with generating random data', {err});
        }
    }
};
