const Koa = require('koa'); // ядро
const Router = require('koa-router'); // маршрутизация
const bodyParser = require('koa-bodyparser'); // парсер для POST запросов
const serve = require('koa-static'); // модуль, который отдает статические файлы типа index.html из заданной директории
const logger = require('koa-logger'); // опциональный модуль для логов сетевых запросов. Полезен при разработке.
const passport = require('koa-passport'); // реализация passport для Koa
const mongoose = require('mongoose'); // стандартная прослойка для работы с MongoDB
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
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

app.use(passport.initialize()); // сначала passport
app.use(router.routes()); // потом маршруты
app.listen(3000); // запускаем сервер на порту 3000

passport.use(localStrategy);
passport.use(jwtStrategy);

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true); // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода
mongoose.connect(db.url, {useMongoClient: true});
mongoose.connection.on('error', console.error);
