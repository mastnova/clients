const User = require('../schemas/user');
const Errors = require('../errors');

module.exports = function (app) {
  app.get('/api/root', function (req, res, next) {
    User.findOne({ role: 'root' }, function (err, user) {
      if (err) next(err);
      if (user) {
        res.send({ hasRoot: true});
      } else {
        res.send({ hasRoot: false });
      }
    });
  });

  app.put('/api/root/update', function (req, res, next) {
    const login = req.body.login;
    const password = req.body.password;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user && user.role === 'root') {
        user.login = login;
        user.password = password;
        user.save(function (err) {
          if (err) {
            res.status(400);
            err.code === 11000 ? res.send(Errors.userExist) : res.send(err);
          } else {
            res.send({status: 'ok'});
          }
        });
      } else {
        res.status(403);
        res.send(Errors.notAllowed);
      }
    })
  });
}