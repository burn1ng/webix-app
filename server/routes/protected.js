// const checkAuthMiddleware = require('./middlewares/checkAuth');
const passport = require('koa-passport'); // реализация passport для Koa
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = require('../config/app').jwt;
const controllers = require('../controllers');

const checkAuthMiddleware = require('./middlewares/checkAuth');


module.exports = (router) => {
    router.all('/admin', checkAuthMiddleware, async (ctx) => {
        ctx.status = 200;
        ctx.body = true;
        // ctx.status = 302;
        // ctx.set('Location', '/admin');
        // ctx.redirect('/admin.html');
        // ctx.set = {Location: '/admin.html'};
        // await controllers.user.sendAdminPage(ctx);
        // ctx.status = 200;
        // ctx.message = 'you are login successfully to dashboard';
        // ctx.status = 301;
        // ctx.body = 'Redirecting to shopping cart';
        // ctx.status = 301;
        // ctx.append('Location', 'admin.html');
    });
};
