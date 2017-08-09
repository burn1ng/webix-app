const checkAuthMiddleware = require('./middlewares/checkAuth');
const controllers = require('../controllers');

module.exports = function (router) {
    router.post('/api/user', checkAuthMiddleware, controllers.user.createUser);
    router.post('/api/login', controllers.user.loginUser);

    router.get('/api/getWords', checkAuthMiddleware, controllers.word.getWords);

    // router.get('/custom', checkAuthMiddleware, (ctx) => {
    //     console.log(ctx);
    //     ctx.body = `hello ${ctx.loggedUser.displayName}`;
    // });

    // TODO refactor code below


    router.post('/api/word', checkAuthMiddleware, async (ctx) => {
        try {
            ctx.body = await Word.create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(401, 'Problem with adding word in database', {err});
        }
    });

    router.put('/api/word/:id', checkAuthMiddleware, async (ctx) => {
        ctx.body = await Word.findByIdAndUpdate(ctx.request.body._id, {
            $set: {
                originalWord: ctx.request.body.originalWord,
                translationWord: ctx.request.body.translationWord,
                partOfSpeech: ctx.request.body.partOfSpeech
            }
        },
        {new: true},
        (err, rawResponse) =>
        // console.log(rawResponse);
            rawResponse
        );

    // ctx.body = await Word.findById(ctx.request.body._id, (err, word) => {
    //     if (err) ctx.throw(500, 'can\'t find required record in database:', {err});

    //     console.log(word);
    //     word.originalWord = ctx.request.body.originalWord;
    //     word.translationWord = ctx.request.body.translationWord;
    //     word.partOfSpeech = ctx.request.body.partOfSpeech;
    //     console.log(word);

    //     word.save((saveErr, updatedWord) => {
    //         if (saveErr) ctx.throw(500, 'can\'t save Word in database: ', {err});
    //         return updatedWord;
    //     });
    // });
    // console.log(ctx.response.body);
    });
};
