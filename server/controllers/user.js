const User = require('../models/users');
const fs = require('fs');
const passport = require('koa-passport');
const jwt = require('jsonwebtoken'); // auth for http by JWT
const jwtsecret = require('../config/app').jwt;

const readFileThunk = src => new Promise((resolve, reject) => {
    fs.readFile(src, {encoding: 'utf8'}, (err, data) => {
        if (err) reject(err);
        resolve(data);
    });
});

module.exports = {
    async sendPublicPage(ctx) {
        ctx.status = 200;
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = await readFileThunk('./public.html');
    },
    // async sendProtectedPage(ctx) {
    //     ctx.status = 200;
    //     ctx.type = 'text/html; charset=utf-8';
    //     ctx.body = await readFileThunk('./protected.html');
    // },
    async createUser(ctx) {
        try {
            let user = await User.create(ctx.request.body);
            ctx.body = {displayName: user.displayName};
            ctx.status = 200;
        }
        catch (err) {
            ctx.throw(400, 'User creation is failed', {err});
        }
    },
    async loginUser(ctx) {
        try {
            await passport.authenticate('local', (err, user) => {
                if (user === false) {
                    ctx.status = 401;
                    ctx.body = 'Login failed';
                }
                else {
                    // payload - information in token, which we can get
                    const payload = {
                        id: user.id,
                        displayName: user.displayName,
                        email: user.email
                    };
                    const token = jwt.sign(payload, jwtsecret); // creating JWT here

                    ctx.status = 200;
                    ctx.body = {user: user.displayName, token: `JWT ${token}`};
                }
            })(ctx);
        }
        catch (err) {
            if (err) {
                ctx.throw(500, 'User login is failed', {err});
            }
        }
    }
};
