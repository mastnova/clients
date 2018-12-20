const User = require('../schemas/user');
const Errors = require('../errors');

module.exports = function (app) {
  app.post('/api/login', function (req, res, next) {
    const login = req.body.login;
    const password = req.body.password;
    User.findOne({ login }, function (err, user) {
      if (err) next(err);
      if (user) {
        if (user.passwordIsValid(password)) {
          const role = user.role;
          const token = user.generateToken();
          user.token = token;
          user.save(function (err, updatedUser) {
            if (err) next(err);
            res.cookie('token', token, { httpOnly: true, sameSite: true});
            res.send({ status: 'ok', role });
          })
        } else {
          res.status(403)
          res.send(Errors.authFailed);
        }
      } else {
        res.status(403)
        res.send(Errors.authFailed);
      }
    });
  });
}