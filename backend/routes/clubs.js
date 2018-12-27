const User = require('../schemas/user');
const Club = require('../schemas/club');
const Errors = require('../errors');

const clubsProjection = {
  name: true,
  address: true,
  clientsCount: true,
  created: true,
  status: true,
  owner: true,
};

module.exports = function (app) {
  app.get('/api/clubs', function (req, res, next) {
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.find({ owner: user.id }, clubsProjection, function (err, clubs) {
          if (err) next(err);
          res.send(clubs);
        })
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });

  app.get('/api/clubs/:agentId', function (req, res, next) {
    const token = req.cookies['token'];
    const agentId = req.params.agentId;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        if(user.role === 'root') {
          const search = agentId === 'all' ? {} : { owner: agentId };
          Club.find(search, clubsProjection, function (err, clubs) {
            if (err) next(err);
            res.send(clubs);
          })
        } else {
          res.status(403);
          res.send(Errors.notAllowed);
        }
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });
}