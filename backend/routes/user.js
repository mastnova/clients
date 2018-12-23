const User = require('../schemas/user');
const Club = require('../schemas/club');
const Errors = require('../errors');

module.exports = function (app) {
  app.post('/api/user', function (req, res, next) {
    const login = req.body.login;
    const password = req.body.password;
    const role = req.body.role;
    const clubId = req.body.clubId;
    const token = req.cookies['token'];
    if (role === 'root') {
      User.findOne({ role }, function (err, user) {
        if (err) next(err);
        if (user) {
          res.status(403);
          res.send(Errors.rootExist)
        } else {
          new User({ login, password, role })
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
    } else if (role === 'agent') {
      User.findOne({ token }, function (err, user) {
        if (err) next(err);
        if (user) {
          if (user.role === 'root') {
            new User({ login, password, role })
              .save(function (error, user) {
                if (error) {
                  res.status(400);
                  error.code === 11000 ? res.send(Errors.userExist) : res.send(error);
                }
                else {
                  res.send({ status: 'ok' });
                }
              });
          } else {
            res.status(403);
            res.send(Errors.notAllowed)
          }
        } else {
          res.status(401);
          res.send(Errors.invalidToken);
        }
      });
    } else if (role === 'operator') {
      User.findOne({ token }, function (err, user) {
        if (err) next(err);
        if (user) {
          Club.findById(clubId, function (err, club) {
            if (err) next(err);
            if (club) {
              if (club.owner == user.id) {
                new User({ login, password, role, clubId })
                .save(function (error, operator) {
                  if (error) {
                    res.status(400);
                    error.code === 11000 ? res.send(Errors.userExist) : res.send(error);
                  } else {
                    club.addOperator(operator.id);
                    club.save(function(error) {
                      if (error) {
                        res.status(400);
                        res.send(error)
                      } else {
                        res.send({ status: 'ok' });
                      }
                    })
                  }
                });
              } else {
                res.status(403);
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
    }
  });
}