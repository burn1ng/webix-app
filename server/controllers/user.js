const User = require('../models/user');
const fs = require('fs');
const passport = require('koa-passport'); // реализация passport для Koa
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = require('../config/app').jwt;

const readFileThunk = src => new Promise((resolve, reject) => {
    fs.readFile(src, {encoding: 'utf8'}, (err, data) => {
        if (err) reject(err);
        resolve(data);
    });
});

module.exports = {
    async sendLoginPage(ctx) {
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = await readFileThunk('./login.html');
    },
    async sendAdminPage(ctx) {
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = await readFileThunk('./admin.html');
        console.log(ctx);
    },
    // CREATE
    async createUser(ctx) {
        try {
            ctx.body = await User.create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(400, 'User creation is failed', {err});
        }
    },
    // ?READ
    async loginUser(ctx) {
        await passport.authenticate('local', (err, user) => {
            if (err) {
                ctx.body = 'Error login route';
            }
            if (user == false) {
                ctx.status = 401;
                ctx.body = 'Login failed';
                // ctx.redirect('/public');
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
                ctx.headers = {token: `JWT ${token}`};
                ctx.redirect = '/admin';
                // ctx.body = {user: user.displayName, token: `JWT ${token}`};
            }
        })(ctx);
    }
};
