const Errors = require('../errors');
const root = require('./root');
const user = require('./user');
const users = require('./users');
const client = require('./client');
const clients = require('./clients');
const club = require('./club');
const clubs = require('./clubs');
const operators = require('./operators');
const promotion = require('./promotion');
const login = require('./login');

module.exports = function (app) {
  root(app);
  user(app);
  users(app);
  client(app);
  clients(app);
  login(app);
  club(app);
  clubs(app);
  operators(app);
  promotion(app);

  //catch 404
  app.use(function (req, res, next) {
    res.status(404)
    res.send(Errors.notFound);
  });
}