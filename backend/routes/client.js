const User = require('../schemas/user');
const Client = require('../schemas/client');
const Club = require('../schemas/club');
const Promotion = require('../schemas/promotion');
const Errors = require('../errors');
const SMS = require('../sms');

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
          if (client && (client.status !== 'removed' || user.role === 'root')) {
            Club.findById(client.club, function (err, club) {
              if (err) next(err);
              if (club) {
                if (club.owner == user.id || user.role === 'root') {
                  const promoIds = [...new Set(client.promotions.map( promo => promo.id))];
                  Promotion.find({ '_id': { $in: promoIds} }, function(err, promotions) {
                    const promoMap = {};
                    promotions.forEach(promo => {
                      promoMap[promo.id] = {status: promo.status, name: promo.name};
                    })
                    client.promotions = client.promotions.map(promo => ({...promo, status: promoMap[promo.id].status, name: promoMap[promo.id].name}));
                    res.send(client);
                  });
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
    const code = req.body.code;
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
              Client.findOne({ club: operator.clubId, phone, status: 'active' }, function (err, client) {
                if (err) next(err);
                if (client) {
                  if (!promotion.id) {
                    res.status(403);
                    res.send({
                      ...Errors.clientExist,
                      info: {
                        name: client.name,
                        phone: client.phone,
                        created: client.created
                      }
                    });
                  } else {
                    Promotion.findById(promotion.id, function(err, promo) {
                      if (promo.status === 'active' ) {
                        if (client.hasPromotion(promotion.id)) {
                          res.status(403);
                          res.send({
                            ...Errors.clientPromoted,
                            info: client.getPromotion(promotion.id)
                          });
                        } else {
                          client.addPromotion({
                            ...promotion,
                            creator: {
                              login: operator.login,
                              avatar: operator.avatar,
                            }
                          });
                          client.save(function (error) {
                            if (error) {
                              res.status(400);
                              res.send(error);
                            } else {
                              res.send({ status: 'promoted' });
                            }
                          });
                        }
                      } else {
                        res.status(404);
                        res.send(Errors.notFound);
                      }
                    });
                  }
                } else {
                  Promotion.findById(promotion.id, function (err, promo) {
                    if (!promo || promo.status === 'active') {
                      if (!SMS.validateCode(code)) {
                        res.status(400);
                        res.send(Errors.wrongVerificationCode);
                        return;
                      }
                      let promotions = [];
                      if (promotion.id) {
                        promotions.push({
                          ...promotion,
                          creator: {
                            login: operator.login,
                            avatar: operator.avatar,
                          },
                          date: new Date().getTime(),
                        });
                      }
                      new Client({ name, phone, promotions, club: operator.clubId, creator: { login: operator.login, avatar: operator.avatar } })
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
                                res.send({ status: 'registered' });
                              }
                            });
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

  app.post('/api/client/is_exist', function (req, res, next) {
    const phone = req.body.phone;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, operator) {
      if (err) next(err);
      if (operator) {
        Client.findOne({ club: operator.clubId, phone, status: 'active' }, function (err, client) {
          if (err) next(err);
          if (client) {
            res.send({ is_exist: true });
          } else {
            SMS.createCode(phone);
            res.send({ is_exist: false });
          }
        });
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });

  app.put('/api/client/name', function (req, res, next) {
    const id = req.body.id;
    const name = req.body.name;
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
                  client.changeName(name);
                  client.save(function (err, cl) {
                    if (err) {
                      next(err);
                    } else {
                      res.send(cl);
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