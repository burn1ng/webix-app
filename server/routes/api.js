const checkAuthMiddleware = require('./middlewares/checkAuth');
const controllers = require('../controllers');

module.exports = (router) => {
    router.post('/api/user', checkAuthMiddleware, controllers.user.createUser);
    router.post('/api/login', controllers.user.loginUser);

    router.get('/api/getWords', checkAuthMiddleware, controllers.word.getWords); // read
    router.post('/api/word', checkAuthMiddleware, controllers.word.createWord); // create

    router.put('/api/word/:id', checkAuthMiddleware, controllers.word.updateWord); // update

    router.del('/api/word/:id', checkAuthMiddleware, controllers.word.deleteWord); // delete

    // TODO: prefix for /api/
};
