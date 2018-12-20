const User = require('../schemas/user');
const Club = require('../schemas/club');
const Errors = require('../errors');

const clubsProjection = {
  name: true,
  address: true,
  clientsCount: true,
  created: true,
  status: true,
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
}