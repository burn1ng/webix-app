const controllers = require('../controllers');

module.exports = (router) => {
    router.all('/', (ctx) => {
        ctx.redirect('/admin');
        ctx.status = 302;
    });

    router.get('/public', controllers.user.sendLoginPage);
};
