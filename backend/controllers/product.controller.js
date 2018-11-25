const Product = require('../models/product.model');

//Simple version, without validation or sanitation
var MongoClient = require('mongodb').MongoClient
exports.test = function (req, res) {
	MongoClient.connect('mongodb://localhost:27017/CLIENTS', function (err, client) {
		if (err) throw err

		var db = client.db('CLIENTS')
	  
		db.collection('users').find().toArray(function (err, result) {
			if (err) throw err
			res.send(result);
		})
	});
};