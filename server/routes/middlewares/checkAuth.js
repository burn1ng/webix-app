const passport = require('koa-passport'); // реализация passport для Koa

module.exports = async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
        if (user) {
            ctx.request.user = user;
            await next(user);
        }
        else {
            ctx.status = 401;
            ctx.body = 'access denied, please log in again or register';
            console.log(ctx.request.body);
        }
    })(ctx, next);
};

