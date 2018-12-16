const User = require('../schemas/user');
const Errors = require('../errors');

const usersProjection = {
  login: true,
  role: true,
  created: true,
};

module.exports = function (app) {
  app.get('/api/users', function (req, res, next) {
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        if (user.role === 'root') {
          User.find({}, usersProjection, function (err, users) {
            if (err) next(err);
            res.send(users);
          })
        } else {
          res.send([]);
        }
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });
}