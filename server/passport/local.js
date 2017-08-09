const LocalStrategy = require('passport-local');
const User = require('../models/user');

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
},
(email, password, done) => {
    User.findOne({email}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user || !user.checkPassword(password)) {
            return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
        }
        return done(null, user);
    });
}
);
