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
          if (client && client.status !== 'removed') {
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
        Club.findById(operator.clubId, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.status !== 'active') {
              res.status(403);
              res.send(Errors.notAllowed);
            } else {
              Client.findOne({ club: operator.clubId, phone }, function (err, client) {
                if (err) next(err);
                if (client && client.status === 'active') {
                  if (!promotion.id) {
                    res.status(403);
                    res.send(Errors.clientExist);
                  } else {
                    if (client.hasPromotion(promotion.id)) {
                      res.status(403);
                      res.send(Errors.clientPromoted);
                    } else {
                      client.addPromotion({ ...promotion, creator: operator.login });
                      client.save(function (error) {
                        if (error) {
                          res.status(400);
                          res.send(error);
                        } else {
                          res.send({ status: 'ok' });
                        }
                      });
                    }
                  }
                } else {
                  let promotions = [];
                  if (promotion.id) {
                    promotions.push({
                      ...promotion,
                      creator: operator.login,
                      date: new Date().getTime(),
                    });
                  }
                  new Client({ name, phone, promotions, club: operator.clubId, creator: operator.login })
                  .save(function (error) {
                    if (error) {
                      res.status(400);
                      res.send(error);
                    } else {
                      club.increaseClientsCounter();
                      club.save(function (error) {
                        if (error) {
                          res.status(400);
                          res.send(error);
                        } else {
                          res.send({ status: 'ok' });
                        }
                      });
                    }
                  });
                }
              });
            }
          } else {
            res.status(404);
            res.send(Errors.notFound);
          }
        });
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });

  app.put('/api/client', function (req, res, next) {
    const id = req.body.id;
    const status = req.body.status;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Client.findById(id, function (err, client) {
          if (err) next(err);
          if (client) {
            Club.findById(client.club, function (err, club) {
              if (club) {
                if (club.owner == user.id || user.role === 'root') {
                  client.changeStatus(status);
                  client.save(function (err) {
                    if (err) {
                      next(err);
                    } else {
                      club.decreaseClientsCounter();
                      club.save(function (err) {
                        if (err) {
                          next(err)
                        } else {
                          res.send({ status: 'ok' });
                        }
                      });
                    }
                  });
                } else {
                  res.status(403);
                  res.send(Errors.notAllowed);
                }
              } else {
                res.status(400);
                res.send(err);
              }
            });
          } else {
            res.status(404);
            res.send(Errors.notFound);
          }
        });
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    })
  });
}