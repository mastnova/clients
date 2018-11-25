var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.get('/', function (req, res) {
	//res.send('Hello World!1');
	res.set('Content-Type', 'text/html');
	res.send(new Buffer('<html><body style="margin: 0; padding: 0;"><img style="width: 100%; height: 100%" src="/pic.jpg"></body></html>'));
});


 const product = require('./backend/routes/product.route'); // Imports routes for the products

app.use('/products', product); 

var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/CLIENTS', function (err, client) {
  if (err) throw err

  var db = client.db('CLIENTS')
  
  db.collection('users').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
})
// This is REQUIRED for IISNODE to work
app.listen(process.env.PORT, () => {
	console.log('listening')
})