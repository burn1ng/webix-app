const controllers = require('../controllers');
const checkAuthMiddleware = require('./middlewares/checkAuth');


module.exports = (router) => {
    router.all('/dashboard', checkAuthMiddleware, async (ctx) => {
        ctx.status = 200;
        ctx.body = true;
    });
};
