var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config');
// app.get('/', function (req, res) {
// 	//res.send('Hello World!1');
// 	res.set('Content-Type', 'text/html');
// 	res.send(new Buffer('<html><body style="margin: 0; padding: 0;"><img style="width: 100%; height: 100%" src="/pic.jpg"></body></html>'));
// });
app.use(bodyParser.json({ strict: false }));
app.use(express.static(path.join(__dirname, config.get('static-dir'))));
// app.get('/', function (req, res) {
//   res.render('index.html');
// })
var db;
 const product = require('./backend/routes/product.route'); // Imports routes for the products

app.use('/products', product); 
app.get('/api/login', (req, res) => {
  var x = db.collection('users').find({name: 'admin'}).toArray((a1, a2) => {
    console.log(a1)
    console.log('==========')
    console.log(a2)
  });
  // db.collection('users').find().toArray(function (err, result) {
  //   if (err) throw err
  //   console.log(result)
  //   res.send({ message: 'invalid login ' + result[0].name });
  // })
});

app.get('/api/has_root', (req, res) => {
  // db.collection('users').findOne({ role: 'admin' })
  db.collection('users').find({role: 'admin'}).toArray(function (err, result) {
    if (err) throw err
    res.send({ hasRoot: result.length ? true : false });
  })
});

const user = {};
var MongoClient = require('mongodb').MongoClient

MongoClient.connect(config.get('db-host'), function (err, client) {
  if (err) throw err

   db = client.db('CLIENTS')
  
  
})
require('./backend/routes')(app);
const port = process.env.PORT || config.get('port');

app.listen(port, () => {
	console.log(`listening on ${port}...`)
})