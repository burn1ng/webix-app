const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
const User = require('../models/user');
const jwtsecret = require('../config/app').jwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: jwtsecret
};

module.exports = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.id, (err, user) => {
        if (err) {
            done(err);
        }
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    });
});
