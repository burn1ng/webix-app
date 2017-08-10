const passport = require('koa-passport'); // реализация passport для Koa

module.exports = async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user) => {
        if (user) {
            await next(user);
        }
        else {
            ctx.status = 401;
            ctx.body = 'access denied, please log in again or register';
            ctx.redirect('/');
        }
    })(ctx, next);
};

