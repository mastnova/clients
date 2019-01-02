const User = require('../schemas/user');
const Errors = require('../errors');

module.exports = function (app) {
  app.delete('/api/operator/:id', function (req, res, next) {
    const token = req.cookies['token'];
    const id = req.params.id;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        User.findById(id, function(err, operator) {
          if (err) next(err);
          if (operator) {
            if (operator.parent == user.id || user.role === 'root') {
              operator.remove(function() {
                res.send({status: 'ok'})
              });
            } else {
              res.status(401);
              res.send(Errors.notAllowed)
            }
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