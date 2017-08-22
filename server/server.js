const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser'); // parser for POST requests
const serve = require('koa-static'); // send static files such as index.html from current directory
const logger = require('koa-logger'); // опциональный модуль для логов сетевых запросов. Полезен при разработке.
const passport = require('koa-passport');
const mongoose = require('mongoose'); // object model for MongoDB
const db = require('./config/db');
const appRoutes = require('./routes/');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

mongoose.Promise = Promise; // tell Mongoose to use standard Promises
mongoose.set('debug', true); // tell Mongoose to write all request to db in console. convinient for debugging
mongoose.connect(db.url, {useMongoClient: true});

mongoose.connection.on('connected', () => {
    console.log(`\n mongoose connected to ${db.url} \n`);
});
mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected');
});
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));


const app = new Koa();
const router = new Router();

appRoutes(router);

app.use(serve('./'));
app.use(logger());
app.use(bodyParser());

app.use(passport.initialize()); // first passport
app.use(router.routes()); // after that - routes !!important
app.use(router.allowedMethods()); // Returns separate middleware for responding to OPTIONS requests
app.listen(3000);

passport.use(localStrategy);
passport.use(jwtStrategy);

