const User = require('../schemas/user');
const Errors = require('../errors');

module.exports = function (app) {
  app.post('/api/user', function (req, res, next) {
    const login = req.body.login;
    const password = req.body.password;
    const role = req.body.role;
    if (role === 'root') {
      User.findOne({ role }, function (err, user) {
        if (err) next(err);
        if (user) {
          res.status(403);
          res.send(Errors.rootExist)
        } else {
          new User({  login, password, role })
          .save(function (error, user) {
            if (error) {
              res.status(400);
              res.send(error);
            }
            else {
              res.send({status: 'ok'});
            }
          });
        }
      });
    }
  });
}