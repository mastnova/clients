var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
// app.get('/', function (req, res) {
// 	//res.send('Hello World!1');
// 	res.set('Content-Type', 'text/html');
// 	res.send(new Buffer('<html><body style="margin: 0; padding: 0;"><img style="width: 100%; height: 100%" src="/pic.jpg"></body></html>'));
// });
app.use(express.static(path.join(__dirname, 'frontend/build')));
// app.get('/', function (req, res) {
//   res.render('index.html');
// })
var db;
 const product = require('./backend/routes/product.route'); // Imports routes for the products

app.use('/products', product); 
app.get('/api/login', (req, res) => {
  db.collection('users').find().toArray(function (err, result) {
    if (err) throw err
    console.log(result)
    res.send({ message: 'invalid login ' + result[0].name });
  })
});

const user = {};
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/CLIENTS', function (err, client) {
  if (err) throw err

   db = client.db('CLIENTS')
  
  
})
const port = process.env.PORT || 8080;
// This is REQUIRED for IISNODE to work
app.listen(port, () => {
	console.log(`listening on ${port}...`)
})