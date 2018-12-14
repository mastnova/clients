const Errors = require('../errors');
const root = require('./root');
const user = require('./user');
const users = require('./users');
const login = require('./login');

module.exports = function (app) {
  root(app);
  user(app);
  users(app);
  login(app);

  //catch 404
  app.use(function (req, res, next) {
    res.status(404)
    res.send(Errors.notFound);
  });
}