const User = require('../schemas/user');
const Club = require('../schemas/club');
const Client = require('../schemas/client');
const Errors = require('../errors');

module.exports = function (app) {
  app.delete('/api/agent/:id', function (req, res, next) {
    const id = req.params.id;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        User.findById(id, function (err, agent) {
          if (err) next(err);
          if (agent && user.role === 'root') {
            Club.find({owner: agent.id}, function (err, clubs = []) {
              const clubsIds = clubs.map( club => club.id);
              Client.deleteMany({ 'club': { $in: clubsIds } }, function() {
                User.deleteMany({'parent': agent.id}, function () {
                  Club.deleteMany({ '_id': { $in: clubsIds }}, function() {
                    agent.remove(function() {
                      res.send({ status: 'ok' })
                    });
                  })
                });
              });
            });
          } else {
            res.status(404);
            res.send(Errors.notFound)
          }
        });
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });
};