const User = require('../schemas/user');
const Club = require('../schemas/club');
const Promotion = require('../schemas/promotion');
const Client = require('../schemas/client');
const Errors = require('../errors');

module.exports = function (app) {
  app.post('/api/promotion/:clubId', function (req, res, next) {
    const token = req.cookies['token'];
    const clubId = req.params.clubId;
    const name = req.body.name;
    const description = req.body.description;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.findById(clubId, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner == user.id || user.role === 'root') {
              new Promotion({name, description, club: clubId})
              .save(function(err){
                if (err) next(err);
                res.send({status: 'ok'});
              });
            } else {
              res.status(401);
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

  app.get('/api/promotion/:id', function (req, res, next) {
    const token = req.cookies['token'];
    const id = req.params.id;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Promotion.findById(id, function (err, promotion) {
          if (err) next(err);
          if (promotion) {
            Client.find({ 'promotions.id': id, status: 'active' }, function(err, clients) {
              res.send({...promotion.result(), clients: [...clients]})
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

  app.put('/api/promotion/update', function (req, res, next) {
    const token = req.cookies['token'];
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Promotion.findById(id, function (err, promotion) {
          if (err) next(err);
          if (promotion) {
            Club.findById(promotion.club, function(err, club) {
              if (club) {
                if (club.owner === user.id || user.role === 'root') {
                  Promotion.update({'_id': id}, {name, description}, function(err, promo) {
                    res.send({status: 'ok'});
                  })
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
}