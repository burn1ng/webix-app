const checkAuthMiddleware = require('./middlewares/checkAuth');
const controllers = require('../controllers');

module.exports = (router) => {
    router.post('/api/user', checkAuthMiddleware, controllers.user.createUser);
    router.post('/api/login', controllers.user.loginUser);

    router.get('/api/getWords', checkAuthMiddleware, controllers.word.getWords);
    router.post('/api/word', checkAuthMiddleware, controllers.word.createWord);

    router.put('/api/word/:id', checkAuthMiddleware, controllers.word.updateWord);

    // TODO: prefix for /api/ and 2 different routes in server.js
};
