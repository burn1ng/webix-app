const PublicRoutes = require('./public');
const ProtectedRoutes = require('./protected');
const ApiRoutes = require('./api');

module.exports = (router) => {
    PublicRoutes(router);
    ProtectedRoutes(router);
    ApiRoutes(router);
};
