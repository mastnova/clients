const User = require('../schemas/user');
const Club = require('../schemas/club');
const Errors = require('../errors');

const usersProjection = {
  login: true,
  role: true,
  created: true,
  status: true,
};

module.exports = function (app) {
  app.get('/api/operators/:clubId', function (req, res, next) {
    const token = req.cookies['token'];
    const id = req.params.clubId;
    User.findOne({ token }, function (err, agent) {
      if (err) next(err);
      if (agent) {
        Club.findById(id, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner == agent.id) {
              User.find({'_id': {$in: club.operators}}, usersProjection, function (err, ops) {
                if (err) next(err);
                if (ops) {
                  res.send(ops)
                }
              });
            } else {
              res.status(401);
              res.send(Errors.notAllowed)
            }
          } else {
            res.status(404);
            res.send(Errors.notFound)
          }
        })
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });
}