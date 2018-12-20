const User = require('../schemas/user');
const Errors = require('../errors');

const usersProjection = {
  login: true,
  role: true,
  created: true,
};

module.exports = function (app) {
  app.get('/api/client/:clientId', function (req, res, next) {
    const token = req.cookies['token'];
    const id = req.params.clientId;
    if (id === '1') {
      res.send({ id: 1, name: 'vasya', phone: '902-129-12-12', actions: [{ name: 'super' }, { name: 'puper' }] })
    } else if (id === '2') {
      res.send({ id: 2, name: 'sanya', phone: '922-972-42-11', actions: [{ name: 'superistick' }, { name: 'puperistick' }] })
    } else {
      res.send({})
    }
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