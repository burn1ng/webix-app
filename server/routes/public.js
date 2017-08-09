module.exports = (router) => {
    router.get('/', async (ctx) => {
        try {
            ctx.body = 'мы перенаправились!';
            // TODO REDIRECT TO ADMIN route
        }
        catch (err) {
            ctx.throw(500, 'failed', {err});
        }
    });


    router.get('/guest/', async (ctx, next) => {
        // todo return page login.html to user
    });
};
