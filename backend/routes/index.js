const Errors = require('../errors');
const root = require('./root');
const user = require('./user');
const agent = require('./agent');
const agents = require('./agents');
const client = require('./client');
const clients = require('./clients');
const club = require('./club');
const clubs = require('./clubs');
const operator = require('./operator');
const operators = require('./operators');
const promotion = require('./promotion');
const login = require('./login');

module.exports = function (app) {
  root(app);
  user(app);
  agent(app);
  agents(app);
  client(app);
  clients(app);
  login(app);
  club(app);
  clubs(app);
  operator(app);
  operators(app);
  promotion(app);
}