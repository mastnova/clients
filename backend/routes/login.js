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
          if (user.status !== 'active') {
            res.status(403)
            res.send(Errors.accountBlocked);
          } else {
            const login = user.login;
            const role = user.role;
            const token = user.generateToken();
            user.token = token;
            user.save(function (err, updatedUser) {
              if (err) next(err);
              res.cookie('token', token, { httpOnly: true, sameSite: true });
              if (role === 'operator') {
                res.send({ status: 'ok', role, login, clubId: user.clubId });
              } else {
                res.send({ status: 'ok', role, login });
              }
            })
          }
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