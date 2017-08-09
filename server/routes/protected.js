// const checkAuthMiddleware = require('./middlewares/checkAuth');
const passport = require('koa-passport'); // реализация passport для Koa
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = require('../config/app').jwt;
const controllers = require('../controllers');

const checkAuthMiddleware = require('./middlewares/checkAuth');


module.exports = (router) => {
    router.all('/admin', checkAuthMiddleware, async (ctx) => {
        // await controllers.user.sendAdminPage(ctx);
        ctx.body = 'дратути';
        // ctx.redirect('/admin.html');
    });
    // router.get('/adminPage', async (ctx, next) => {
    //     await passport.authenticate('jwt', (err, user) => {
    //         if (user) {
    //             // console.log(ctx);
    //             // ctx.body = `hello ${user.displayName}`;
    //             // TODO send admin.html to client
    //             // ctx.redirect('/admin');
    //             // ctx.status = 200;
    //             // controllers.user.sendAdminPage();
    //             controllers.user.sendAdminPage(ctx);
    //         }
    //         else {
    //             ctx.status = 401;
    //             ctx.redirect('/public');
    //         }
    //     })(ctx, next);
    // });
};
