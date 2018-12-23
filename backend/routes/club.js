const User = require('../schemas/user');
const Club = require('../schemas/club');
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
            if (club.owner == user.id) {
              res.send(club)
            } else if (club.operators.includes(user.id)) {
              res.send({name: club.name, promotions: club.promotions})
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
          new User({ login, password, role: 'operator' })
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
      }
    })
  });
}