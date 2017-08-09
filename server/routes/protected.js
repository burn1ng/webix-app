// const checkAuthMiddleware = require('./middlewares/checkAuth');
const passport = require('koa-passport'); // реализация passport для Koa
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = require('../config/app').jwt;


module.exports = (router) => {
    router.get('/admin', async (ctx, next) => {
        await passport.authenticate('local', (err, user) => {
            if (err) {
                ctx.body = 'Error login route';
            }
            if (user == false) {
                ctx.status = 401;
                ctx.body = 'Login failed';

                // TODO REDIRECT TO guest route
                // set header or method for setting header
            }
            else {
            // --payload - информация которую мы храним в токене и можем из него получать
                const payload = {
                    id: user.id,
                    displayName: user.displayName,
                    email: user.email
                };
                const token = jwt.sign(payload, jwtsecret); // здесь создается JWT

                ctx.status = 200;
                ctx.body = {user: user.displayName, token: `JWT ${token}`};

                // TODO return admin.html to client
            }
        })(ctx, next);
    });
};
