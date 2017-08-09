const mongoose = require('mongoose');
const crypto = require('crypto'); // for executing crypting operations and creation of password hash

const userSchema = new mongoose.Schema({
    displayName: String,
    email: {
        type: String,
        required: 'Укажите e-mail',
        unique: true
    },
    passwordHash: String,
    salt: String
}, {
    timestamps: true
});

userSchema.virtual('password')
    .set(function (password) {
        // no arrow function, because we use [this]
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        }
        else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })

    .get(function () {
        // no arrow function, because we use [this]
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    // no arrow function, because we use [this]
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
