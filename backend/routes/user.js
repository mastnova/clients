// const User = require('../dbSchema/user');
// import User from '../schemas/user';

module.exports = function (app) {
  app.post('/api/user', function (req, res, next) {
  let login = req.body.login;
  let password = req.body.password;
  let role = req.body.role;
  console.log('aaaaa')
    console.log(req.body)
    console.log('bbbb')
    console.log(req)
  res.send({login, password, role})
  // let location;
  // new User({ name: login, password: password, role })
  //   .save(function (error, user) {
  //     if (error) {
  //       location = '/register';
  //     }
  //     else {
  //       req.session.user = user._id;
  //       location = '/';
  //     }
  //     res.status(302);
  //     res.setHeader('Location', location);
  //     res.end();
  //   });
  });
}