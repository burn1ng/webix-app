const Koa = require('koa'); // ядро
const Router = require('koa-router'); // маршрутизация
const bodyParser = require('koa-bodyparser'); // парсер для POST запросов
const serve = require('koa-static'); // модуль, который отдает статические файлы типа index.html из заданной директории
const logger = require('koa-logger'); // опциональный модуль для логов сетевых запросов. Полезен при разработке.

const passport = require('koa-passport'); // реализация passport для Koa
const LocalStrategy = require('passport-local'); // локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const jwtsecret = 'lookMa!ItIsMySecretKey'; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp

const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
const db = require('./config/db');

const app = new Koa();
const router = new Router();
app.use(serve('./'));
app.use(logger());
app.use(bodyParser());

app.use(passport.initialize()); // сначала passport
app.use(router.routes()); // потом маршруты
app.listen(3000); // запускаем сервер на порту 3000

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true); // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода
mongoose.connect(db.url, {useMongoClient: true});

mongoose.connection.on('error', console.error);
// ---------Схема и модель пользователя------------------//

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
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

// ---------Schema and model of Word ------------------//

const wordSchema = new mongoose.Schema({
    originalWord: {
        type: String,
        required: true,
        unique: true,
        maxlength: 45
    },
    translationWord: {
        type: String,
        required: true,
        maxlength: 150
    },
    partOfSpeech: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Word = mongoose.model('Word', wordSchema);

// ----------Passport Local Strategy--------------//

passport.use(new LocalStrategy({
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
)
);

// ----------Passport JWT Strategy--------//

// Ждем JWT в Header
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.id, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    });
})
);

// ------------Routing for users---------------//

// маршрут для создания нового пользователя

router.post('/user', async (ctx) => {
    try {
        ctx.body = await User.create(ctx.request.body);
    }
    catch (err) {
        ctx.throw(400, 'User creation is failed', {err});
    }
});

router.post('/login', async (ctx, next) => {
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
});

router.get('/custom', async (ctx, next) => {
    await passport.authenticate('jwt', (err, user) => {
        if (user) {
            ctx.body = `hello ${user.displayName}`;
        }
        else {
            ctx.status = 401;
            ctx.body = 'access denied, please log in again or register';
        }
    })(ctx, next);
});

// router.all('*', async (ctx, next) => {
//     await passport.authenticate('jwt', (err, user, info) => {
//         if (err) return next(err);
//         if (user) {
//             ctx.body = `hello ${user.displayName}`;
//             return next();
//         }
//         ctx.status = 401;
//     })(ctx, next);
// });

// ------------Routing for words---------------//

// read route for all words
router.get('/getWords', async (ctx) => {
    try {
        ctx.body = await Word.find({});
    }
    catch (err) {
        ctx.throw(500, 'Sorry, can\'t find words in database', {err});
    }
});

router.post('/word', async (ctx) => {
    try {
        ctx.body = await Word.create(ctx.request.body);
    }
    catch (err) {
        ctx.throw(401, 'Problem with adding word in database', {err});
    }
});

router.put('/word/:id', async (ctx) => {
    ctx.body = await Word.findByIdAndUpdate(ctx.request.body._id, {
        $set: {
            originalWord: ctx.request.body.originalWord,
            translationWord: ctx.request.body.translationWord,
            partOfSpeech: ctx.request.body.partOfSpeech
        }
    },
    {new: true},
    (err, rawResponse) =>
        // console.log(rawResponse);
        rawResponse
    );

    // ctx.body = await Word.findById(ctx.request.body._id, (err, word) => {
    //     if (err) ctx.throw(500, 'can\'t find required record in database:', {err});

    //     console.log(word);
    //     word.originalWord = ctx.request.body.originalWord;
    //     word.translationWord = ctx.request.body.translationWord;
    //     word.partOfSpeech = ctx.request.body.partOfSpeech;
    //     console.log(word);

    //     word.save((saveErr, updatedWord) => {
    //         if (saveErr) ctx.throw(500, 'can\'t save Word in database: ', {err});
    //         return updatedWord;
    //     });
    // });
    // console.log(ctx.response.body);
});
