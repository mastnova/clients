const User = require('../schemas/user');
const Client = require('../schemas/client');
const Club = require('../schemas/club');
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
    User.findOne({token}, function (err, user) {
      if (err) next(err);
      if (user) {
        Client.findById(id, function(err, client) {
          if (err) next(err);
          if (client) {
            Club.findById(client.club, function (err, club) {
              if (err) next(err);
              if (club) {
                if (club.owner == user.id || user.role === 'root') {
                  res.send(client);
                } else {
                  res.status(403);
                  res.send(Errors.notAllowed);
                }
              } else {
                res.status(404);
                res.send(Errors.notFound);
              }
            })
          } else {
            res.status(404);
            res.send(Errors.notFound);
          }
        })
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
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
            if (!promotion.id) {
              res.status(403);
              res.send(Errors.clientExist);
            } else {
              if (client.hasPromotion(promotion.id)) {
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
            if (promotion.id) {
              promotions.push({
                ...promotion,
                date: new Date().getTime(),
              });
            }
            new Client({ name, phone, promotions, club: operator.clubId, creator: operator.id })
            .save(function (error) {
              if (error) {
                res.status(400);
                res.send(error);
              } else {
                Club.findById(operator.clubId, function(err, club) {
                  if (err) next(err);
                  if (club) {
                    club.increaseClientsCounter();
                    club.save(function(error) {
                      if (error) {
                        res.status(400);
                        res.send(error);
                      } else {
                        res.send({ status: 'ok' });
                      }
                    });
                  } else {
                    res.status(404);
                    res.send(Errors.notFound);
                  }
                });
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