const controllers = require('../controllers');
const checkAuthMiddleware = require('./middlewares/checkAuth');


module.exports = (router) => {
    router.all('/dashboard', checkAuthMiddleware, async (ctx) => {
        // console.log('я попробовал тыкнуть в /dashboard, и токен заебись');
        // await controllers.user.sendProtectedPage(ctx);
        ctx.status = 200;
        ctx.body = true;
    });
};
