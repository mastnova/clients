const User = require('../schemas/user');
const Errors = require('../errors');

const usersProjection = {
  login: true,
  role: true,
  created: true,
};

module.exports = function (app) {
  app.get('/api/clients/:clubId', function (req, res, next) {
    const token = req.cookies['token'];
    res.send([
      {id: 1, name: 'vasya', phone: '902-129-12-12'},
      {id: 2, name: 'sanya', phone: '922-972-42-11'},
    ]);
    // User.findOne({ token }, function (err, user) {
    //   if (err) next(err);
    //   if (user) {
    //     if (user.role === 'root') {
    //       User.find({}, usersProjection, function (err, users) {
    //         if (err) next(err);
    //         res.send(users);
    //       })
    //     } else {
    //       res.send([]);
    //     }
    //   } else {
    //     res.status(401);
    //     res.send(Errors.invalidToken);
    //   }
    // });
  });
}