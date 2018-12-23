const User = require('../schemas/user');
const Client = require('../schemas/client');
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

  app.post('/api/client', function (req, res, next) {
    const name = req.body.name;
    const phone = req.body.phone;
    const promotion = req.body.promotion;
    const token = req.cookies['token'];

    User.findOne({ token }, function (err, operator) {
      if (err) next(err);
      if (operator) {
        Client.findOne({ club: operator.clubId, phone}, function (err, client) {
          if (err) next(err);
          if (client) {
            if (!promotion) {
              res.status(403);
              res.send(Errors.clientExist);
            } else {
              if (client.hasPromotion(promotion)) {
                res.status(403);
                res.send(Errors.clientPromoted);
              } else {
                client.addPromotion(promotion);
                client.save(function(error) {
                  if (error) {
                    res.status(400);
                    res.send(error);
                  } else {
                    res.send({status: 'ok'});
                  }
                });
              }
            }
          } else {
            let promotions = [];
            if (promotion) {
              promotions.push({
                id: promotion,
                date: new Date().getTime(),
              });
            }
            new Client({ name, phone, promotions, club: operator.clubId })
            .save(function (error) {
              if (error) {
                res.status(400);
                res.send(error);
              }
              else {
                res.send({ status: 'ok' });
              }
            });
          }
        });
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });
}