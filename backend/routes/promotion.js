const User = require('../schemas/user');
const Club = require('../schemas/club');
const Errors = require('../errors');
const crypto = require('crypto');

module.exports = function (app) {
  app.post('/api/promotion/:clubId', function (req, res, next) {
    const token = req.cookies['token'];
    const clubId = req.params.clubId;
    const id = crypto.randomBytes(16).toString("hex");
    const name = req.body.name;
    const description = req.body.description;
    const created = new Date().getTime();
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.findById(clubId, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner == user.id || user.role === 'root') {
              club.promotions.push({id, name, description, created});
              club.save(function(err){
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
}