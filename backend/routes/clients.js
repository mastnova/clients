const User = require('../schemas/user');
const Club = require('../schemas/club');
const Client = require('../schemas/client');
const Errors = require('../errors');

const usersProjection = {
  login: true,
  role: true,
  created: true,
};

module.exports = function (app) {
  app.get('/api/clients/:clubId', function (req, res, next) {
    const token = req.cookies['token'];
    const clubId = req.params.clubId;
    User.findOne({ token }, function (err, user) {
      if (err) next(err);
      if (user) {
        Club.findById(clubId, function (err, club) {
          if (err) next(err);
          if (club) {
            if (club.owner === user.id || user.role === 'root') {
              Client.find({club: clubId}, function(err, clients) {
                if (err) next(err);
                res.send(clients);
              })
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
    });
  });
}