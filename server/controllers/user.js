const User = require('../models/user');
const passport = require('koa-passport'); // реализация passport для Koa
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = require('../config/app').jwt;

module.exports = {
    async createUser(ctx) {
        try {
            ctx.body = await User.create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(400, 'User creation is failed', {err});
        }
    },
    async loginUser(ctx) {
        await passport.authenticate('local', (err, user) => {
            if (err) {
                ctx.body = 'Error login route';
            }
            if (user == false) {
                ctx.status = 401;
                ctx.body = 'Login failed';
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
            }
        })(ctx, next);
    }
};
