const controllers = require('../controllers');

module.exports = (router) => {
    router.all('/', controllers.user.sendPublicPage);
    // (ctx) => {
    // console.log(ctx.request);
    // ctx.redirect('/dashboard');
    // console.log(ctx.request);
    // });

    router.get('/public', controllers.user.sendPublicPage);
};
