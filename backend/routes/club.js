const User = require('../schemas/user');
const Club = require('../schemas/club');
const Client = require('../schemas/client');
const Errors = require('../errors');

module.exports = function (app) {
  app.get('/api/club/:clubId', function (req, res, next) {
    const token = req.cookies['token'];
    const id = req.params.clubId;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.findById(id, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner == user.id || user.role === 'root') {
              res.send(club)
            } else if (club.operators.includes(user.id)) {
              res.send({name: club.name, promotions: club.promotions, status: club.status})
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
        res.status(401);
        res.send(Errors.invalidToken);
      }
    });
  });

  app.post('/api/club', function (req, res, next) {
    const name = req.body.name;
    const address = req.body.address;
    const login = req.body.login;
    const password = req.body.password;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, agent) {
      if (err) next(err);
      if (agent) {
        if (agent.role === 'agent') {
          new User({ login, password, role: 'operator', parent: agent.id })
          .save(function (error, operator) {
            if (error) {
              res.status(400);
              error.code === 11000 ? res.send(Errors.userExist) : res.send(error);
            } else {
              new Club({ name, address, owner: agent.id, operators: [operator.id] })
              .save(function (error, club) {
                if (error) {
                  res.status(400);
                  res.send(error);
                }
                else {
                  operator.clubId = club.id;
                  operator.save(function (err, op) {
                    if (err) {
                      next(err);
                    } else {
                      res.send({ status: 'ok'});
                    }
                  });
                }
              });
            }
          });
        }
      } else {
        res.status(401);
        res.send(Errors.invalidToken);
      }
    })
  });

  app.put('/api/club', function (req, res, next) {
    const id = req.body.id;
    const status = req.body.status;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.findById(id, function(err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner == user.id || user.role === 'root') {
              club.changeStatus(status);
              club.save(function(err, club) {
                if (err) {
                  next(err);
                } else {
                  if (status === 'removed') {
                    User.deleteMany({ '_id': { $in: club.operators } }, function (err) {
                      Client.updateMany({ club: club.id }, { status: status }, {}, function(err){
                        if (err) console.log(err);
                      })
                    });
                  }
                  res.send(club);
                }
              });
            } else {
              res.status(403);
              res.send(Errors.notAllowed);
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
    })
  });

  app.put('/api/club/name', function (req, res, next) {
    const id = req.body.id;
    const name = req.body.name;
    const token = req.cookies['token'];
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.findById(id, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner == user.id || user.role === 'root') {
              club.changeName(name);
              club.save(function (err, club) {
                if (err) {
                  next(err);
                } else {
                  res.send(club);
                }
              });
            } else {
              res.status(403);
              res.send(Errors.notAllowed);
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
    })
  });
}