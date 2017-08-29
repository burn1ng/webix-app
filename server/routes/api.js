const checkAuthMiddleware = require('./middlewares/checkAuth');
const controllers = require('../controllers');

module.exports = (router) => {
    router.post('/api/user', controllers.user.createUser);
    router.post('/api/login', controllers.user.loginUser);

    router.get('/api/words', checkAuthMiddleware, controllers.word.getWords); // read
    router.post('/api/word', checkAuthMiddleware, controllers.word.createWord); // create
    router.put('/api/word/:id', checkAuthMiddleware, controllers.word.updateWord); // update
    router.del('/api/word/:id', checkAuthMiddleware, controllers.word.deleteWord); // delete

    // TODO: prefix for /api/

    router.get('/api/wordgroup/', checkAuthMiddleware, controllers.wordgroup.getWordsByWordGroupId); // read
    router.get('/api/wordgroups', checkAuthMiddleware, controllers.wordgroup.getWordGroups); // read
    router.post('/api/wordgroup', checkAuthMiddleware, controllers.wordgroup.createWordGroup); // create
    router.put('/api/wordgroup/:id', checkAuthMiddleware, controllers.wordgroup.updateWordGroup); // update
    router.del('/api/wordgroup/:id', checkAuthMiddleware, controllers.wordgroup.deleteWordGroup); // delete

    router.get('/api/results', checkAuthMiddleware, controllers.test.getTests); // read
    router.post('/api/generateTest', checkAuthMiddleware, controllers.test.generateTest); // create
    router.put('/api/updateTest', checkAuthMiddleware, controllers.test.updateTest); // update
    router.del('/api/results/:id', checkAuthMiddleware, controllers.test.deleteTest); // delete
};
