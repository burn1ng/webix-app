const Koa = require('koa'); // ядро
const Router = require('koa-router'); // маршрутизация
const bodyParser = require('koa-bodyparser'); // парсер для POST запросов
const serve = require('koa-static'); // модуль, который отдает статические файлы типа index.html из заданной директории
const logger = require('koa-logger'); // опциональный модуль для логов сетевых запросов. Полезен при разработке.
const passport = require('koa-passport'); // реализация passport для Koa
const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const db = require('./config/db');
const appRoutes = require('./routes/');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const app = new Koa();
const router = new Router();

appRoutes(router);


app.use(serve('./'));
app.use(logger());
app.use(bodyParser());

app.use(passport.initialize()); // first passport
app.use(router.routes()); // after that - routes !!important
app.use(router.allowedMethods()); // Returns separate middleware for responding to OPTIONS requests
app.listen(3000); // запускаем сервер на порту 3000

passport.use(localStrategy);
passport.use(jwtStrategy);

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true); // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода
mongoose.connect(db.url, {useMongoClient: true});
mongoose.connection.on('error', (err) => {
    if (err) throw err;
});
