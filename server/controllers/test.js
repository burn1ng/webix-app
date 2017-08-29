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
        let jsonResponse = {
            steps: [],
            _id: 0
        };
        // create new Test
        try {
            let newTest = await Test.create(
                {
                    _wordGroup: wordGroupId,
                    _creator: ctx.request.user.id,
                    score: 0
                }
            );
            jsonResponse._id = newTest._id;
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

                let currentStep = {
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

                currentStep.variants = middleArr;

                jsonResponse.steps[i] = currentStep;
            }));

            ctx.body = jsonResponse;
        }
        catch (err) {
            ctx.throw(500, 'Problem with generating random data', {err});
        }
    },
    // READ
    async getTests(ctx) {
        try {
            ctx.body = await Test.find({_creator: ctx.request.user.id});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find test results in database for that user', {err});
        }
    },
    async updateTest(ctx) {
        try {
            let req = ctx.request.body;
            ctx.body = await Test.findByIdAndUpdate(
                req._id,
                {$set:
                    {
                        score: req.score || 0
                    },
                $inc: {__v: 1}
                },
                {new: true},
                (err, updatedTest) => {
                    if (err) throw err;
                    console.log('this is updatedTest! \n');
                    console.log(updatedTest);
                    console.log('\n Test is updated!');
                }
            );
        }
        catch (err) {
            ctx.throw(500, 'Problem with update word in database', {err});
        }
    },
    async deleteTest(ctx) {
        try {
            ctx.body = await Test.remove({_id: ctx.request.body._id}, () => {
                console.log('deleting test is successfull');
            });
        }
        catch (err) {
            ctx.throw(500, 'Problem with deleting test from database', {err});
        }
    }
};
