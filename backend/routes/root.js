const User = require('../schemas/user');

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
}